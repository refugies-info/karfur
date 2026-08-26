import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";
import useRouteAnnouncement, { ROUTE_ANNOUNCER_ID } from "./useRouteAnnouncement";

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
    mockRouter.setCurrentUrl("/");
    mockRouter.locale = "fr";
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

    it("n'écrit rien au montage, sans navigation", () => {
      const paragraph = addAnnouncer();
      document.title = "Réfugiés.info";

      renderHook(() => useRouteAnnouncement());
      flushFrames();

      expect(paragraph.textContent).toBe("");
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
