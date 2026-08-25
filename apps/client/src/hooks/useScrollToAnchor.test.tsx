import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import useScrollToAnchor from "./useScrollToAnchor";

jest.mock("next/router", () => require("next-router-mock"));

/**
 * Piège de test, à ne pas retirer : le hook compare `window.location.pathname`,
 * pas `router.pathname`. `next-router-mock` ne touche jamais l'objet `location`
 * de jsdom. Sans `window.history.pushState`, tous les cas verraient "/" et
 * prendraient la branche même-page, donc les tests passeraient au vert en
 * prouvant l'inverse de ce qu'ils visent.
 */
const setLocation = (url: string) => window.history.pushState({}, "", url);

/** Le hook écoute au niveau `document` : il faut un vrai lien dans le DOM. */
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
    // Le hook diffère la mesure d'une trame pour laisser la barre d'évitement du
    // DSFR se replier. On la rend synchrone pour pouvoir assertionner le défilement.
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    jest.spyOn(mockRouter, "push");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("ancre de même page, liens d'évitement, RGAA 12.7", () => {
    it("ne navigue pas depuis une route dynamique, pose le focus et défile vers la cible", () => {
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

    it("pose le focus avant de mesurer, pour que la barre d'évitement soit repliée", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("contenu");
      const focusSpy = jest.spyOn(target, "focus");

      clickAnchor("#contenu");

      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
      expect(callOrder(focusSpy)).toBeLessThan(callOrder(window.scrollTo));
    });

    it("ne navigue pas depuis une route statique", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("#contenu");

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("n'écrase pas un tabindex déjà porté par la cible et lui donne quand même le focus", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      const target = addTarget("contenu", "0");

      clickAnchor("#contenu");

      expect(target.getAttribute("tabIndex")).toBe("0");
      expect(document.activeElement).toBe(target);
    });

    it("ne demande aucune navigation, donc laisse l'URL de recherche intacte", () => {
      setLocation("/recherche?search=logement&sort=default");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("#contenu");

      // C'est cette assertion qui prouve la conservation de la chaîne de requête :
      // le défaut corrigé venait d'un `router.push("")` que Next résolvait en motif
      // de route, ce qui effaçait la query. L'assertion sur `window.location.search`
      // ci-dessous est documentaire : `next-router-mock` ne touche jamais `location`,
      // elle ne pourrait donc pas échouer. La preuve réelle est la mesure navigateur.
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.location.search).toBe("?search=logement&sort=default");
    });

    it("ne navigue pas quand le chemin de l'ancre est déjà le chemin courant", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());
      addTarget("contenu");

      clickAnchor("/agir#contenu");

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("ancre inter-pages", () => {
    it("navigue vers la page cible avant de défiler vers l'ancre", async () => {
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

  describe("cas limites", () => {
    it("ne lève pas et ne navigue pas sur un href réduit à un dièse", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      expect(() => clickAnchor("#")).not.toThrow();
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("ne lève pas, ne navigue pas et ne défile pas quand la cible n'existe pas", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      expect(() => clickAnchor("#cible-absente")).not.toThrow();
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("ignore les liens sans ancre", () => {
      setLocation("/agir");
      renderHook(() => useScrollToAnchor());

      clickAnchor("/recherche");

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
