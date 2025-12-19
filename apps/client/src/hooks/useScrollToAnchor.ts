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
      // Calculate position with offset for header
      const headerOffset = 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Manage focus
      if (!element.hasAttribute("tabIndex")) {
        element.setAttribute("tabIndex", "-1");
      }
      element.focus({ preventScroll: true });
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

        if (path !== window.location.pathname) {
          router.push(path, undefined, { scroll: false }).then(() => {
            scrollToHash(hash);
          });
        } else {
          scrollToHash(hash);
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
