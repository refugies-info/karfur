import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import useRouteAnnouncement, {
  clearAnchorNavigation,
  markAnchorNavigation,
  ROUTE_ANNOUNCER_ID,
} from "./useRouteAnnouncement";
import useScrollToAnchor from "./useScrollToAnchor";

jest.mock("next/router", () => require("next-router-mock"));

/**
 * The hook waits for the title through `requestAnimationFrame`. Frames are
 * driven by hand so the overlap scenarios can be replayed: each call to
 * `flushFrames(1)` plays one frame, `flushFrames()` drains the queue.
 */
let frameQueue: FrameRequestCallback[] = [];
const flushFrames = (count = Number.POSITIVE_INFINITY) => {
  let played = 0;
  while (frameQueue.length > 0 && played < count) {
    const callbacks = frameQueue;
    frameQueue = [];
    for (const callback of callbacks) callback(0);
    played += 1;
  }
};

const addAnnouncer = () => {
  const paragraph = document.createElement("p");
  paragraph.id = ROUTE_ANNOUNCER_ID;
  paragraph.tabIndex = -1;
  paragraph.className = "sr-only";
  document.body.prepend(paragraph);
  return paragraph;
};

describe("useRouteAnnouncement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    document.title = "";
    frameQueue = [];
    clearAnchorNavigation();
    window.history.pushState({}, "", "/");
    mockRouter.setCurrentUrl("/");
    mockRouter.locale = "fr";
    // Without this parser, `router.pathname` would hold the resolved URL and
    // comparing it to the route pattern would prove nothing.
    mockRouter.useParser(createDynamicRouteParser(["/demarche/[id]", "/dispositif/[id]"]));
    window.scrollTo = jest.fn();
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frameQueue.push(callback);
      return frameQueue.length;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("title announcement", () => {
    it("copies the incoming document.title verbatim after a navigation", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/agir");
      });
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("AGIR pour les personnes réfugiées - Réfugiés.info");
    });

    it("writes nothing and does not move the focus on mount, without a navigation", () => {
      // Also covers the first visit, where the language modal opens on its own:
      // no navigation happens, the hook touches nothing.
      const paragraph = addAnnouncer();
      document.title = "Réfugiés.info";

      renderHook(() => useRouteAnnouncement());
      flushFrames();

      expect(paragraph.textContent).toBe("");
      expect(document.activeElement).not.toBe(paragraph);
    });

    it("re-announces the content on every navigation, even towards an identical title", async () => {
      // Real pair: /auth and /auth/inscription both declare the same
      // title="Bienvenue". The paragraph must be rewritten every time.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      document.title = "Bienvenue - Réfugiés.info";
      await act(async () => {
        await mockRouter.push("/auth");
      });
      flushFrames();
      const firstTextNode = paragraph.firstChild;
      expect(paragraph.textContent).toBe("Bienvenue - Réfugiés.info");

      await act(async () => {
        await mockRouter.push("/auth/inscription");
      });
      flushFrames();

      expect(paragraph.textContent).toBe("Bienvenue - Réfugiés.info");
      // The text node was set afresh: proof of the forcing gesture, without
      // which React/DOM would announce nothing on an identical text.
      expect(paragraph.firstChild).not.toBe(firstTextNode);
    });
  });

  describe("empty title and routes without a <title>", () => {
    it("never writes a URL path, even when the title stays empty", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/download-app");
      });
      flushFrames(5);
      expect(paragraph.textContent).not.toContain("/download-app");
      flushFrames();

      expect(paragraph.textContent).not.toContain("/");
    });

    it("writes a humanized fallback derived from the route pattern when the title stays empty", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/download-app");
      });
      flushFrames();

      expect(paragraph.textContent).toBe("Download app");
    });

    it("writes the title as soon as it is set, even if it was momentarily empty", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/plan-du-site");
      });
      flushFrames(2);
      expect(paragraph.textContent).toBe("");
      document.title = "Plan du site - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("Plan du site - Réfugiés.info");
    });
  });

  describe("guards", () => {
    it("does nothing on a shallow navigation (typing in the search field)", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Recherche - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/recherche?search=logement", undefined, { shallow: true });
      });
      flushFrames();

      expect(paragraph.textContent).toBe("");
    });

    it("does nothing when only the locale changes on the same page", async () => {
      // Real case: first-load language redirect and language modal validation,
      // a non-shallow router.replace.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/", undefined, { locale: "uk" });
      });
      flushFrames();

      expect(paragraph.textContent).toBe("");
      expect(document.activeElement).not.toBe(paragraph);
    });

    it("announces a navigation that changes both the page and the locale", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Пландусайту - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/plan-du-site", undefined, { locale: "uk" });
      });
      flushFrames();

      expect(paragraph.textContent).toBe("Пландусайту - Réfugiés.info");
    });
  });

  describe("overlapping navigations", () => {
    it("does not write afterwards when a navigation supersedes another", async () => {
      // The first navigation waits for its title; a second one starts before
      // the wait ends. The stale wait must not write anything anymore.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/agir");
      });
      // The /agir wait is queued, title still empty. A second navigation
      // starts: the generation token invalidates the wait.
      mockRouter.events.emit("routeChangeStart", "/plan-du-site", { shallow: false });
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("");
    });

    it("only the last of two back-to-back navigations writes", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/agir");
      });
      await act(async () => {
        await mockRouter.push("/plan-du-site");
      });
      document.title = "Plan du site - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("Plan du site - Réfugiés.info");
    });
  });

  describe("error paths", () => {
    it("does not throw when the paragraph is missing from the DOM", async () => {
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/agir");
      });

      expect(() => flushFrames()).not.toThrow();
    });

    it("keeps the title of the last completed navigation after a routeChangeError", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      // A navigation starts then fails: nothing must be rewritten.
      mockRouter.events.emit("routeChangeStart", "/plan-du-site", { shallow: false });
      mockRouter.events.emit("routeChangeError", new Error("cancelled"), "/plan-du-site", {
        shallow: false,
      });
      flushFrames();

      expect(paragraph.textContent).toBe("AGIR pour les personnes réfugiées - Réfugiés.info");
    });
  });

  describe("focus repositioning", () => {
    it("focuses the paragraph after an ordinary navigation, without scrolling", async () => {
      const paragraph = addAnnouncer();
      const focusSpy = jest.spyOn(paragraph, "focus");
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      expect(document.activeElement).toBe(paragraph);
      // preventScroll: without it, the focus would scroll the page back to the
      // top and break the position restoration on browser back (R16).
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });

    it("does not move the focus on an autofocus route, but syncs the text", async () => {
      // VoiceOver verdict of 26/08: on these pages the field announcement is
      // authoritative. Also covers the case of a field not mounted yet at
      // routeChangeComplete time: the hook never takes the focus on these routes.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Bienvenue - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/auth");
      });
      flushFrames();

      expect(document.activeElement).not.toBe(paragraph);
      expect(paragraph.textContent).toBe("Bienvenue - Réfugiés.info");
    });

    it("compares the route pattern, not the resolved URL, on a dynamic route", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Demander l'asile - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/demarche/63528e00976acb4f7bcd37ad");
      });
      flushFrames();

      expect(mockRouter.pathname).toBe("/demarche/[id]");
      expect(document.activeElement).toBe(paragraph);
    });

    it("refocuses the paragraph on every navigation, even with an identical title", async () => {
      // Forcing gesture: focus() on an already focused element emits nothing.
      // The hook blurs then refocuses, one focus event per navigation.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      const focusEvents = jest.fn();
      paragraph.addEventListener("focus", focusEvents);
      document.title = "Bienvenue - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/plan-du-site");
      });
      flushFrames();
      expect(document.activeElement).toBe(paragraph);

      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      expect(document.activeElement).toBe(paragraph);
      expect(focusEvents).toHaveBeenCalledTimes(2);
    });
  });

  describe("anchor flag, shared with useScrollToAnchor", () => {
    it("leaves the focus on the target of an inter-page anchor, not on the paragraph", async () => {
      // Real case: footer newsletter link from /agir (R9).
      window.history.pushState({}, "", "/agir");
      const paragraph = addAnnouncer();
      const target = document.createElement("div");
      target.id = "newsletter";
      document.body.appendChild(target);
      renderHook(() => {
        useScrollToAnchor();
        useRouteAnnouncement();
      });
      document.title = "Réfugiés.info";

      const anchor = document.createElement("a");
      anchor.setAttribute("href", "/#newsletter");
      document.body.appendChild(anchor);
      await act(async () => {
        anchor.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      flushFrames();

      expect(document.activeElement).toBe(target);
      expect(paragraph.textContent).toBe("");
    });

    it("consumes the flag: the next navigation gets the paragraph back", async () => {
      // Without the reset, a stuck flag would silence the announcement for the
      // rest of the session.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      markAnchorNavigation();
      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();
      expect(document.activeElement).not.toBe(paragraph);
      expect(paragraph.textContent).toBe("");

      await act(async () => {
        await mockRouter.push("/plan-du-site");
      });
      document.title = "Plan du site - Réfugiés.info";
      flushFrames();

      expect(document.activeElement).toBe(paragraph);
      expect(paragraph.textContent).toBe("Plan du site - Réfugiés.info");
    });

    it("a flag cleared after a rejected push does not affect the next navigation", async () => {
      // The finally in useScrollToAnchor clears the flag even when the push is
      // cancelled by a concurrent navigation.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      markAnchorNavigation();
      clearAnchorNavigation();
      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      expect(document.activeElement).toBe(paragraph);
      expect(paragraph.textContent).toBe("AGIR pour les personnes réfugiées - Réfugiés.info");
    });
  });

  describe("cleanup", () => {
    it("removes the subscription on unmount", async () => {
      const paragraph = addAnnouncer();
      const { unmount } = renderHook(() => useRouteAnnouncement());
      unmount();
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      expect(paragraph.textContent).toBe("");
    });
  });
});
