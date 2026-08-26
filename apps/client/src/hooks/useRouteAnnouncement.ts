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
 * Routes disposant d'un autofocus de page. Verdict de la mesure VoiceOver du
 * 26/08 : sur ces pages, poser le focus sur le paragraphe le vole au champ
 * autofocalisé ; l'annonce du champ fait foi, le paragraphe est synchronisé
 * mais ne reçoit ni focus ni annonce. Liste centralisée, exprimée en
 * `router.pathname`, un commentaire par entrée citant la déclaration
 * d'autofocus et son statut de mesure (mesuré ou seulement déclaré).
 * Procédure de mise à jour : documentation/client/accessibility/voiceover.md.
 */
const AUTOFOCUS_ROUTE_PATTERNS = new Set([
  // src/pages/auth/index.tsx l.162 — mesuré le 25/08 (focus posé sur le champ email)
  "/auth",
  // src/pages/auth/connexion.tsx l.97 — déclaré, non mesuré (redirige vers /fr/auth sans session)
  "/auth/connexion",
  // src/pages/auth/inscription/index.tsx l.112 — déclaré, non mesuré (redirige sans session)
  "/auth/inscription",
  // src/components/User/EditPseudo/EditPseudo.tsx l.62 — déclaré, non mesuré (redirige sans session)
  "/auth/inscription/pseudo",
  // src/components/Pages/auth/CheckCode/CheckCode.tsx l.128 — déclaré, non mesuré (redirige sans session)
  "/auth/code-connexion",
  // src/components/Pages/auth/CheckCode/CheckCode.tsx l.128 — déclaré, non mesuré (redirige sans session)
  "/auth/code-securite",
  // src/components/User/ForgotPassword/ForgotPassword.tsx l.44 — mesuré le 25/08 (focus posé)
  "/auth/reinitialiser-mot-de-passe",
  // src/pages/auth/reinitialiser-mot-de-passe/nouveau.tsx l.122 et l.134 — déclaré ;
  // mesuré le 25/08 SANS focus posé, conservé par prudence tant que l'écart n'est pas expliqué
  "/auth/reinitialiser-mot-de-passe/nouveau",
]);

/**
 * Drapeau de navigation par ancre, partagé avec `useScrollToAnchor` : quand une
 * ancre inter-pages déclenche un `router.push`, la cible de l'ancre garde le
 * focus et le paragraphe ne s'en mêle pas. Posé avant le `push`, consommé au
 * `routeChangeComplete`, remis à zéro dans un `finally` sur la promesse du
 * `push` pour qu'une navigation annulée ne laisse pas un drapeau collé.
 */
let anchorNavigationInProgress = false;

export const markAnchorNavigation = () => {
  anchorNavigationInProgress = true;
};

export const clearAnchorNavigation = () => {
  anchorNavigationInProgress = false;
};

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

const writeAnnouncement = (text: string, moveFocus: boolean) => {
  const paragraph = document.getElementById(ROUTE_ANNOUNCER_ID);
  if (!paragraph) return;
  // Geste de forçage : deux navigations de suite vers un titre identique
  // (`/auth` puis `/auth/inscription`, deux pages en `title="Bienvenue"`)
  // doivent être restituées toutes les deux. Or `focus()` sur un élément déjà
  // focalisé n'émet rien : on sort le focus et on vide le paragraphe avant de
  // réécrire puis refocaliser, pour que la restitution reparte à neuf.
  if (document.activeElement === paragraph) paragraph.blur();
  paragraph.textContent = "";
  paragraph.textContent = text;
  // `preventScroll` : la classe sr-only ne fixant ni top ni left, un focus
  // défilant ferait remonter la page et détruirait la restauration de position
  // au retour arrière navigateur. Motif maison de useScrollToAnchor.
  if (moveFocus) paragraph.focus({ preventScroll: true });
};

/**
 * Annonce le changement de page et repositionne le focus lors des navigations
 * client (RGAA 12.8).
 *
 * Mécanique prescrite par l'audit Ideance : un paragraphe `sr-only` avec
 * `tabindex="-1"` en tête de `<body>` (posé par `_document.tsx`), synchronisé
 * avec le `<title>` de la page d'arrivée et focalisé à chaque navigation.
 * L'annonceur natif de Next (`<next-route-announcer>`) est neutralisé par CSS
 * dans `_dsfr-fix.scss`.
 *
 * Gardes :
 * - navigations superficielles ignorées (saisie dans le champ de recherche) ;
 * - changement de locale seul ignoré (redirection de langue du premier
 *   chargement, validation de la modale de langue) ;
 * - attente du titre annulée si une autre navigation démarre (jeton de
 *   génération) : seule la dernière navigation écrit et focalise ;
 * - route sans `<title>` : repli humanisé tiré du motif de route.
 *
 * Le focus ne se dispute jamais avec un autre mécanisme : la modale de langue
 * du premier chargement, l'autofocus de page (liste centralisée ci-dessus) et
 * la cible d'une ancre (`useScrollToAnchor`, drapeau partagé) le gardent.
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
        // Le focus ne se dispute jamais avec l'autofocus d'une page : sur ces
        // routes, le paragraphe est synchronisé sans être focalisé.
        const moveFocus = !AUTOFOCUS_ROUTE_PATTERNS.has(Router.pathname);
        const title = document.title;
        if (title) {
          writeAnnouncement(title, moveFocus);
          return;
        }
        frames += 1;
        if (frames >= TITLE_WAIT_MAX_FRAMES) {
          const fallback = humanizeRoutePattern(Router.pathname);
          if (fallback) writeAnnouncement(fallback, moveFocus);
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

      // Navigation issue d'une ancre inter-pages (`/#newsletter` depuis le pied
      // de page) : la cible de l'ancre garde le focus, rien à annoncer ici.
      // Le drapeau est consommé, la navigation suivante redevient ordinaire.
      if (anchorNavigationInProgress) {
        anchorNavigationInProgress = false;
        return;
      }

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
