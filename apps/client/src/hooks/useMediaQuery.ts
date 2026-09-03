import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query.
 *
 * Not to be confused with `isMobile` from `useWindowSize`, which compares the
 * viewport width to the root font size. The two diverge as soon as the user
 * zooms the text: the `em` unit of a media query is measured against the
 * browser default font size, which text zoom does not change, whereas the root
 * font size does grow. When a component must follow the same breakpoint as a
 * stylesheet (the DSFR one for instance), this hook is the one to use, not
 * `isMobile`.
 *
 * `defaultValue` is the value of the first render, server side and before mount.
 * Choosing it equal to the original behaviour avoids a jump at hydration.
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
