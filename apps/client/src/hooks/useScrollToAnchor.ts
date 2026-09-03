import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { markAnchorNavigation, unmarkAnchorNavigation } from "./useRouteAnnouncement";

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
      // Focus BEFORE measuring: the DSFR skip link bar shifts the page while it
      // holds the focus, so measuring first lands the scroll off. See voiceover.md.
      element.focus({ preventScroll: true });

      // Measure on the next frame, once the bar has collapsed.
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

        // A same-page anchor (`href="#contenu"`) yields an empty `path`. Treating
        // it as a navigation calls `router.push("")`, which Next resolves to the
        // route pattern: 404 on dynamic routes. Skip links, RGAA 12.7.
        const isSamePage = !path || path === window.location.pathname;

        if (isSamePage) {
          scrollToHash(hash);
        } else {
          // The anchor target keeps the focus: the flag stops useRouteAnnouncement
          // from competing on this navigation (RGAA 12.8). Cleared in a finally so
          // a rejected push does not leave the flag stuck.
          markAnchorNavigation();
          router
            .push(path, undefined, { scroll: false })
            .then(() => {
              scrollToHash(hash);
            })
            .finally(() => {
              unmarkAnchorNavigation();
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
