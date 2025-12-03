import { isInBrowser } from "@refugies-info/ui";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

type ResponsiveFlags = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined, // Initialize as undefined for SSR to avoid hydration errors
    height: undefined, // Initialize as undefined for SSR to avoid hydration errors
  });
  const [responsiveFlags, setResponsiveFlags] = useState<ResponsiveFlags>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
  });
  const hasMountedRef = useRef(false);
  const [fontSize, setFontSize] = useState(16);
  const [zoomLevel, setZoomLevel] = useState(100);

  useIsomorphicLayoutEffect(() => {
    if (!isInBrowser()) {
      return () => {};
    }

    hasMountedRef.current = true;

    const initialSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setWindowSize(initialSize);

    const initialFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    setFontSize(initialFontSize);

    let rafId: number;

    const handleResize = debounce(() => {
      if (!isInBrowser() || !hasMountedRef.current) return;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    const handleFontSizeChange = debounce(() => {
      if (!isInBrowser() || !hasMountedRef.current) return;

      const newFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

      if (newFontSize !== fontSize) {
        setFontSize(newFontSize);
        rafId = requestAnimationFrame(handleResize);
      }
    }, 100);

    const debouncedFontSizeChange = debounce(handleFontSizeChange, 100);

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(debouncedFontSizeChange);
      const mutationObserver = new MutationObserver((mutations) => {
        if (
          mutations.some(
            (m) =>
              (m.type === "attributes" && ["style", "class"].includes(m.attributeName || "")) ||
              (m.type === "childList" && m.target === document.head),
          )
        ) {
          debouncedFontSizeChange();
        }
      });

      handleResize();
      handleFontSizeChange();

      resizeObserver.observe(document.documentElement);
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
      mutationObserver.observe(document.head, { childList: true, subtree: true });

      window.addEventListener("resize", handleResize);
      window.addEventListener("load", handleFontSizeChange);

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && ["+", "-", "0", "="].includes(e.key)) {
          handleFontSizeChange();
        }
      };

      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) handleFontSizeChange();
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("wheel", handleWheel);

      return () => {
        [resizeObserver, mutationObserver].forEach((observer) => observer.disconnect());
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("load", handleFontSizeChange);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("wheel", handleWheel);
        clearTimeout(rafId);
        hasMountedRef.current = false;
      };
    }

    return () => {};
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasMountedRef.current && windowSize.width) {
      setResponsiveFlags({
        isMobile: windowSize.width <= fontSize * 48,
        isTablet: windowSize.width >= fontSize * 48 && windowSize.width < fontSize * 62,
        isDesktop: windowSize.width >= fontSize * 62 && windowSize.width < fontSize * 75,
        isLargeDesktop: windowSize.width >= fontSize * 75,
      });
    }
  }, [windowSize.width, fontSize]);

  useIsomorphicLayoutEffect(() => {
    if (hasMountedRef.current && windowSize.width) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

      if (isFirefox) {
        const defaultFontSize = 16;
        const currentZoom = Math.round((fontSize / defaultFontSize) * 100);
        setZoomLevel(currentZoom);
      } else {
        const isHiDPI =
          window.matchMedia &&
          window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)")
            .matches;

        let currentZoom;
        if (isHiDPI) {
          currentZoom = Math.round((window.devicePixelRatio / 2) * 100);
        } else {
          currentZoom = Math.round(window.devicePixelRatio * 100);
        }

        setZoomLevel(currentZoom);
      }
    }
  }, [fontSize, hasMountedRef.current, windowSize]);

  return { windowSize, zoomLevel, ...responsiveFlags };
};

export default useWindowSize;
