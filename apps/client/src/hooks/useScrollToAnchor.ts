import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

/**
 * Custom hook to enable smooth scrolling for anchor links.
 *
 * - Intercepts clicks on `<a>` elements to prevent full page reloads.
 * - Uses `next/router` to navigate when switching pages.
 * - Scrolls smoothly to the anchor after the route change.
 *
 * @example
 * // Use inside _app.tsx or a layout component
 * useSmoothScroll();
 */
const useScrollToAnchor = () => {
  const router = useRouter();

  /**
   * Scrolls smoothly to the given hash (element ID).
   *
   * @param {string} hash - The target element's ID.
   */
  const scrollToHash = useCallback((hash: string) => {
    const element = document.getElementById(hash);
    if (element) {
      // Manage focus
      if (!element.hasAttribute("tabIndex")) {
        element.setAttribute("tabIndex", "-1");
      }
      // Le focus est posé AVANT la mesure. La barre d'évitement du DSFR passe de
      // `position: absolute` à `position: relative` tant qu'elle garde le focus
      // (`.fr-skiplinks:focus-within`, dsfr.css) et pousse la page de sa hauteur.
      // Mesurer dans cet état puis sortir le focus de la barre la fait se replier
      // pendant l'animation : le défilement atterrit 48 px trop bas et le haut de
      // la cible passe au-dessus de la fenêtre. Mesuré sur /, /agir et une fiche.
      element.focus({ preventScroll: true });

      // La mesure attend la trame suivante, une fois la barre repliée.
      requestAnimationFrame(() => {
        // Calculate position with offset for header
        const headerOffset = 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      });
    }
  }, []);

  /**
   * Handles click events on anchor (`<a>`) elements.
   * Prevents full page reload for internal links with `#` and enables smooth scrolling.
   *
   * @param {MouseEvent} event - The click event.
   */
  const handleAnchorClick = useCallback(
    (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternal =
        href.startsWith("/") || href.startsWith(window.location.origin) || href.startsWith("#");
      const isAnchor = href.includes("#");

      if (isInternal && isAnchor) {
        event.preventDefault(); // Prevent full page reload
        const [path, hash] = href.split("#");

        // Une ancre de même page (`href="#contenu"`) donne un `path` vide après le
        // découpage. La traiter comme une navigation appelle `router.push("")`, que
        // Next résout en motif de route : 404 sur les routes dynamiques et perte de
        // la chaîne de requête ailleurs. Liens d'évitement, RGAA 12.7.
        const isSamePage = !path || path === window.location.pathname;

        if (isSamePage) {
          scrollToHash(hash);
        } else {
          router.push(path, undefined, { scroll: false }).then(() => {
            scrollToHash(hash);
          });
        }
      }
    },
    [router, scrollToHash],
  );

  useEffect(() => {
    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [handleAnchorClick]);
};

export default useScrollToAnchor;
