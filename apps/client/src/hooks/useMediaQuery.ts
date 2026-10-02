import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query. Unlike `useWindowSize().isMobile`, which follows the root
 * font size, an `em` media query ignores text zoom: use this to match a stylesheet breakpoint.
 */
export const useMediaQuery = (query: string, defaultValue = false): boolean => {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
};

export default useMediaQuery;
