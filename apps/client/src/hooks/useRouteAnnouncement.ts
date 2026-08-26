import Router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";

/**
 * Identifiant du paragraphe d'annonce posé tout en haut du `<body>` par
 * `_document.tsx`. Partagé pour que le hook et le document restent alignés.
 */
export const ROUTE_ANNOUNCER_ID = "route-announcer";

/**
 * Nombre maximal de trames d'attente du `<title>` après `routeChangeComplete`.
 * Le titre est posé par `next/head` dans le même cycle de rendu, mais il peut
 * être momentanément vide pendant une transition (mesuré sur les redirections
 * du parcours auth). À 60 Hz cela laisse ~500 ms, à 120 Hz ~250 ms : dans les
 * deux cas plus que les 128 ms mesurées avant qu'une redirection chasse la
 * navigation en cours et invalide l'attente.
 */
const TITLE_WAIT_MAX_FRAMES = 30;

/**
 * Repli lisible pour les routes servies sans `<title>` (mesurées :
 * `/download-app`, `/embed`, `/dispositif`, `/demarche`). On humanise le motif
 * de route plutôt que d'annoncer un chemin d'URL brut ou de focaliser un
 * paragraphe vide (RGAA 12.8, R14/D13). Aucune clé i18n : le motif de route
 * est le seul libellé disponible sans traduction.
 */
const humanizeRoutePattern = (pathname: string): string => {
  const label = pathname
    .replace(/[[\]]|\.{3}/g, "")
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/-/g, " ")
    .trim();
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const writeAnnouncement = (text: string) => {
  const paragraph = document.getElementById(ROUTE_ANNOUNCER_ID);
  if (!paragraph) return;
  // Geste de forçage : deux navigations de suite vers un titre identique
  // (`/auth` puis `/auth/inscription`, deux pages en `title="Bienvenue"`)
  // doivent être restituées toutes les deux. On vide puis on réécrit pour que
  // le contenu soit posé à neuf à chaque navigation.
  paragraph.textContent = "";
  paragraph.textContent = text;
};

/**
 * Annonce le changement de page lors des navigations client (RGAA 12.8).
 *
 * Mécanique prescrite par l'audit Ideance : un paragraphe `sr-only` avec
 * `tabindex="-1"` en tête de `<body>` (posé par `_document.tsx`), synchronisé
 * avec le `<title>` de la page d'arrivée. L'annonceur natif de Next
 * (`<next-route-announcer>`) est neutralisé par CSS dans `_dsfr-fix.scss`.
 *
 * Gardes :
 * - navigations superficielles ignorées (saisie dans le champ de recherche) ;
 * - changement de locale seul ignoré (redirection de langue du premier
 *   chargement, validation de la modale de langue) ;
 * - attente du titre annulée si une autre navigation démarre (jeton de
 *   génération) : seule la dernière navigation écrit ;
 * - route sans `<title>` : repli humanisé tiré du motif de route.
 *
 * @example
 * // Use inside _app.tsx
 * useRouteAnnouncement();
 */
const useRouteAnnouncement = () => {
  const router = useRouter();
  const generationRef = useRef(0);
  const lastRouteRef = useRef<{ pathname: string; locale?: string }>({
    pathname: "",
    locale: undefined,
  });

  useEffect(() => {
    lastRouteRef.current = { pathname: Router.pathname, locale: Router.locale };

    // Jeton de génération : toute navigation qui en chasse une autre rend
    // l'attente de titre de la précédente périmée, sans écriture après coup.
    const handleRouteChangeStart = () => {
      generationRef.current += 1;
    };

    const waitForTitle = (generation: number) => {
      let frames = 0;
      const tick = () => {
        if (generationRef.current !== generation) return; // attente périmée
        const title = document.title;
        if (title) {
          writeAnnouncement(title);
          return;
        }
        frames += 1;
        if (frames >= TITLE_WAIT_MAX_FRAMES) {
          const fallback = humanizeRoutePattern(Router.pathname);
          if (fallback) writeAnnouncement(fallback);
          return;
        }
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };

    const handleRouteChangeComplete = (_url: string, { shallow }: { shallow: boolean }) => {
      const previous = lastRouteRef.current;
      lastRouteRef.current = { pathname: Router.pathname, locale: Router.locale };

      // Navigation superficielle : la recherche pousse une navigation shallow
      // débouncée à chaque frappe, qui ne change pas de page.
      if (shallow) return;

      // Seule la locale change sur la même page : redirection de langue du
      // premier chargement (Layout.tsx), validation de la modale de langue.
      // Ce n'est pas un changement de page, rien à annoncer.
      if (Router.locale !== previous.locale && Router.pathname === previous.pathname) return;

      waitForTitle(generationRef.current);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
    // Abonnement unique au montage, même motif que les abonnements de _app.tsx.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRouteAnnouncement;
