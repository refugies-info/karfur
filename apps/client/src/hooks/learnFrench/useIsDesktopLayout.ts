import { useEffect, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

export const useIsDesktopLayout = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    setIsDesktop(mediaQuery.matches);
    const update = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
};
