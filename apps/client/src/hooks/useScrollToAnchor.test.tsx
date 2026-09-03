import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import useScrollToAnchor from "./useScrollToAnchor";

jest.mock("next/router", () => require("next-router-mock"));
// The shared anchor flag is checked here at the call level; its actual effect
// on the announcement is covered by useRouteAnnouncement.test.tsx.
jest.mock("./useRouteAnnouncement", () => ({
  markAnchorNavigation: jest.fn(),
  clearAnchorNavigation: jest.fn(),
}));

const { markAnchorNavigation, clearAnchorNavigation } = require("./useRouteAnnouncement");

/**
 * Test trap, do not remove: the hook compares `window.location.pathname`, not
 * `router.pathname`. `next-router-mock` never touches the jsdom `location`
 * object. Without `window.history.pushState`, every case would see "/" and take
 * the same-page branch, so the tests would pass while proving the opposite of
 * what they target.
 */
const setLocation = (url: string) => window.history.pushState({}, "", url);

/** The hook listens at the `document` level: a real link in the DOM is needed. */
const clickAnchor = (href: string) => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.textContent = "lien";
  document.body.appendChild(anchor);
  anchor.click();
  return anchor;
};

const addTarget = (id: string, tabIndex?: string) => {
  const target = document.createElement("div");
  target.id = id;
  if (tabIndex !== undefined) target.setAttribute("tabIndex", tabIndex);
  document.body.appendChild(target);
  return target;
};

const callOrder = (fn: unknown) => (fn as jest.Mock).mock.invocationCallOrder[0];

describe("useScrollToAnchor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    mockRouter.setCurrentUrl("/");
    setLocation("/");
    window.scrollTo = jest.fn();
    // The hook defers the measurement by one frame to let the DSFR skip link
    // bar collapse. It is made synchronous here so the scroll can be asserted.
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    jest.spyOn(mockRouter, "push");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("same-page anchor, skip links, RGAA 12.7", () => {
    it("does not navigate from a dynamic route, focuses and scrolls to the target", () => {
      setLocation("/demarche/63528e00976acb4f7bcd37ad");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("contenu");

      clickAnchor("#contenu");

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(target.getAttribute("tabIndex")).toBe("-1");
      expect(document.activeElement).toBe(target);
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: "smooth",
      });
    });

    it("focuses before measuring, so that the skip link bar is collapsed", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("contenu");
      const focusSpy = jest.spyOn(target, "focus");

      clickAnchor("#contenu");

      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
      expect(callOrder(focusSpy)).toBeLessThan(callOrder(window.scrollTo));
    });

    it("does not navigate from a static route", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("#contenu");

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("does not overwrite a tabindex already carried by the target and still focuses it", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("contenu", "0");

      clickAnchor("#contenu");

      expect(target.getAttribute("tabIndex")).toBe("0");
      expect(document.activeElement).toBe(target);
    });

    it("requests no navigation, hence leaves the search URL untouched", () => {
      setLocation("/recherche?search=logement&sort=default");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("#contenu");

      // This assertion is what proves the query string is preserved: the fixed
      // defect came from a `router.push("")` that Next resolved to the route
      // pattern, which wiped the query. The assertion on `window.location.search`
      // below is documentary: `next-router-mock` never touches `location`, so it
      // could not fail. The real proof is the browser measurement.
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.location.search).toBe("?search=logement&sort=default");
    });

    it("does not navigate when the anchor path is already the current path", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("/agir#contenu");

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("inter-page anchor", () => {
    it("navigates to the target page before scrolling to the anchor", async () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("newsletter");

      await act(async () => {
        clickAnchor("/#newsletter");
      });

      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith("/", undefined, { scroll: false });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: "smooth",
      });
      expect(document.activeElement).toBe(target);
      expect(callOrder(mockRouter.push)).toBeLessThan(callOrder(window.scrollTo));
    });
  });

  describe("anchor flag, RGAA 12.8", () => {
    it("sets the flag before the inter-page push and clears it afterwards", async () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("newsletter");

      await act(async () => {
        clickAnchor("/#newsletter");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(markAnchorNavigation).toHaveBeenCalledTimes(1);
      expect(clearAnchorNavigation).toHaveBeenCalledTimes(1);
      expect(callOrder(markAnchorNavigation)).toBeLessThan(callOrder(mockRouter.push));
    });

    it("does not set the flag on a same-page anchor, which does not navigate", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("#contenu");

      expect(markAnchorNavigation).not.toHaveBeenCalled();
    });

    it("clears the flag even when the push is rejected", () => {
      // A navigation cancelled by another one rejects the push promise. Without
      // the finally, the flag would stay stuck and silence the announcement of
      // the next navigation. The push has no catch (pre-existing defect,
      // recorded): a real rejected promise would fail the suite with an
      // unhandled rejection. This fake thenable replays the rejection path: the
      // then callback is skipped, the finally one runs.
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("newsletter");
      const rejectedPush = {
        then() {
          return this;
        },
        finally(callback: () => void) {
          callback();
          return Promise.resolve(true);
        },
      };
      (mockRouter.push as jest.Mock).mockImplementation(
        () => rejectedPush as unknown as Promise<boolean>,
      );

      clickAnchor("/#newsletter");

      expect(markAnchorNavigation).toHaveBeenCalledTimes(1);
      expect(clearAnchorNavigation).toHaveBeenCalledTimes(1);
      // The navigation failed, so the scroll to the target does not happen.
      expect(document.activeElement).not.toBe(target);
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("does not throw and does not navigate on an href reduced to a bare hash", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      expect(() => clickAnchor("#")).not.toThrow();
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("does not throw, navigate or scroll when the target does not exist", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      expect(() => clickAnchor("#cible-absente")).not.toThrow();
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("ignores links without an anchor", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      clickAnchor("/recherche");

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
