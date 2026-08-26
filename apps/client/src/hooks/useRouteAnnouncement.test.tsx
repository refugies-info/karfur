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
 * Le hook attend le titre par `requestAnimationFrame`. On contrôle les trames
 * à la main pour pouvoir jouer les scénarios de chevauchement : chaque appel à
 * `flushFrames(1)` rejoue une trame, `flushFrames()` épuise la file.
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
    // Sans ce parser, `router.pathname` vaudrait l'URL résolue et la
    // comparaison au motif de route ne prouverait rien.
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

  describe("annonce du titre", () => {
    it("recopie exactement le document.title d'arrivée après une navigation", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/agir");
      });
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("AGIR pour les personnes réfugiées - Réfugiés.info");
    });

    it("n'écrit rien et ne déplace pas le focus au montage, sans navigation", () => {
      // Couvre aussi la première visite où la modale de langue s'ouvre seule :
      // aucune navigation n'a lieu, le hook ne touche à rien.
      const paragraph = addAnnouncer();
      document.title = "Réfugiés.info";

      renderHook(() => useRouteAnnouncement());
      flushFrames();

      expect(paragraph.textContent).toBe("");
      expect(document.activeElement).not.toBe(paragraph);
    });

    it("restitue le contenu à chaque navigation, même vers un titre identique", async () => {
      // Couple réel : /auth et /auth/inscription déclarent le même
      // title="Bienvenue". Le paragraphe doit être réécrit à chaque fois.
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
      // Le nœud texte a été posé à neuf : preuve du geste de forçage,
      // sans lequel React/DOM ne restituerait rien sur un texte identique.
      expect(paragraph.firstChild).not.toBe(firstTextNode);
    });
  });

  describe("titre vide et routes sans <title>", () => {
    it("n'écrit jamais un chemin d'URL, même quand le titre reste vide", async () => {
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

    it("écrit un repli humanisé tiré du motif de route quand le titre reste vide", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/download-app");
      });
      flushFrames();

      expect(paragraph.textContent).toBe("Download app");
    });

    it("écrit le titre dès qu'il est posé, même s'il était momentanément vide", async () => {
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

  describe("gardes", () => {
    it("ne fait rien sur une navigation superficielle (saisie dans la recherche)", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());
      document.title = "Recherche - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/recherche?search=logement", undefined, { shallow: true });
      });
      flushFrames();

      expect(paragraph.textContent).toBe("");
    });

    it("ne fait rien quand seule la locale change sur la même page", async () => {
      // Cas réel : redirection de langue du premier chargement et validation
      // de la modale de langue, un router.replace non superficiel.
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

    it("annonce une navigation qui change de page et de locale à la fois", async () => {
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

  describe("navigations chevauchées", () => {
    it("n'écrit pas après coup quand une navigation en chasse une autre", async () => {
      // La première navigation attend son titre ; une seconde démarre avant la
      // fin de l'attente. L'attente périmée ne doit plus rien écrire.
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      await act(async () => {
        await mockRouter.push("/agir");
      });
      // L'attente de /agir est en file, titre encore vide. Une seconde
      // navigation démarre : le jeton de génération invalide l'attente.
      mockRouter.events.emit("routeChangeStart", "/plan-du-site", { shallow: false });
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      flushFrames();

      expect(paragraph.textContent).toBe("");
    });

    it("seule la dernière de deux navigations rapprochées écrit", async () => {
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

  describe("chemins d'erreur", () => {
    it("ne lève pas quand le paragraphe est absent du DOM", async () => {
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/agir");
      });

      expect(() => flushFrames()).not.toThrow();
    });

    it("garde le titre de la dernière navigation aboutie après un routeChangeError", async () => {
      const paragraph = addAnnouncer();
      renderHook(() => useRouteAnnouncement());

      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";
      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      // Une navigation démarre puis échoue : rien ne doit être réécrit.
      mockRouter.events.emit("routeChangeStart", "/plan-du-site", { shallow: false });
      mockRouter.events.emit("routeChangeError", new Error("cancelled"), "/plan-du-site", {
        shallow: false,
      });
      flushFrames();

      expect(paragraph.textContent).toBe("AGIR pour les personnes réfugiées - Réfugiés.info");
    });
  });

  describe("repositionnement du focus", () => {
    it("pose le focus sur le paragraphe après une navigation ordinaire, sans défilement", async () => {
      const paragraph = addAnnouncer();
      const focusSpy = jest.spyOn(paragraph, "focus");
      renderHook(() => useRouteAnnouncement());
      document.title = "AGIR pour les personnes réfugiées - Réfugiés.info";

      await act(async () => {
        await mockRouter.push("/agir");
      });
      flushFrames();

      expect(document.activeElement).toBe(paragraph);
      // preventScroll : sans lui, le focus ferait remonter la page et
      // détruirait la restauration de position au retour arrière (R16).
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });

    it("ne déplace pas le focus sur une route à autofocus, mais synchronise le texte", async () => {
      // Verdict VoiceOver du 26/08 : sur ces pages l'annonce du champ fait
      // foi. Couvre aussi le cas du champ pas encore monté au moment du
      // routeChangeComplete : le hook ne prend jamais le focus sur ces routes.
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

    it("compare le motif de route, pas l'URL résolue, sur une route dynamique", async () => {
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

    it("refocalise le paragraphe à chaque navigation, même à titre identique", async () => {
      // Geste de forçage : focus() sur un élément déjà focalisé n'émet rien.
      // Le hook sort le focus puis le remet, un événement focus par navigation.
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

  describe("drapeau d'ancre, partagé avec useScrollToAnchor", () => {
    it("laisse le focus à la cible d'une ancre inter-pages, pas au paragraphe", async () => {
      // Cas réel : lien newsletter du pied de page depuis /agir (R9).
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

    it("consomme le drapeau : la navigation suivante retrouve le paragraphe", async () => {
      // Sans remise à zéro, un drapeau collé éteindrait l'annonce du reste de
      // la session.
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

    it("un drapeau remis à zéro après un push rejeté n'affecte pas la navigation suivante", async () => {
      // Le finally de useScrollToAnchor remet le drapeau à zéro même quand le
      // push est annulé par une navigation concurrente.
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

  describe("nettoyage", () => {
    it("retire l'abonnement au démontage", async () => {
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
