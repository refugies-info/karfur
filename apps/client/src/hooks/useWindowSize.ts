import { debounce } from "lodash";
import { useEffect, useState } from "react";
import isInBrowser from "~/lib/isInBrowser";

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

const useWindowSize = () => {
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
  const [hasMounted, setHasMounted] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (hasMounted && fontSize) {
      const defaultFontSize = 16;
      const currentZoom = Math.round((fontSize / defaultFontSize) * 100);
      setZoomLevel(currentZoom);
    }
  }, [fontSize, hasMounted]);

  useEffect(() => {
    const checkResponsiveFlags = () => {
      if (hasMounted && windowSize.width) {
        // Use fixed pixel values for breakpoints
        // Convert rem values to pixels using current font size
        // 48rem = 768px at 16px font size
        // 62rem = 992px at 16px font size
        // 75rem = 1200px at 16px font size
        setResponsiveFlags({
          isMobile: windowSize.width <= fontSize * 48,
          isTablet: windowSize.width >= fontSize * 48 && windowSize.width < fontSize * 62,
          isDesktop: windowSize.width >= fontSize * 62 && windowSize.width < fontSize * 75,
          isLargeDesktop: windowSize.width >= fontSize * 75,
        });
      }
    };

    setHasMounted(true);
    if (isInBrowser()) {
      const initialFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (initialFontSize > 0 && initialFontSize !== fontSize) {
        setFontSize(initialFontSize);
      }
      
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      checkResponsiveFlags();
    }

    let rafId: number | undefined;

    const handleResize = debounce(() => {
      if (!isInBrowser()) return;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      checkResponsiveFlags();
    }, 100);

    const handleFontSizeChange = debounce(() => {
      if (!isInBrowser()) return;
      
      const newFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      
      if (newFontSize > 0 && newFontSize !== fontSize) {
        setFontSize(newFontSize);
      }
    }, 100);

    const debouncedFontSizeChange = debounce(handleFontSizeChange, 100);

    if (isInBrowser() && typeof ResizeObserver !== "undefined") {
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
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
      mutationObserver.observe(document.head, { childList: true, subtree: true });

      window.addEventListener("resize", handleResize);
      window.addEventListener("load", handleFontSizeChange);

      const keydownHandler = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && ["+", "-", "0", "="].includes(e.key)) {
          setTimeout(handleFontSizeChange, 100);
        }
      };
      
      const wheelHandler = (e: WheelEvent) => {
        if (e.ctrlKey) {
          setTimeout(handleFontSizeChange, 100);
        }
      };
      
      window.addEventListener("keydown", keydownHandler);
      window.addEventListener("wheel", wheelHandler);
      window.addEventListener("load", handleFontSizeChange);
      
      const bodyObserver = new MutationObserver(handleFontSizeChange);
      if (document.body) {
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
      }

      return () => {
        [resizeObserver, mutationObserver].forEach((observer) => observer.disconnect());
        if (document.body) {
          bodyObserver.disconnect();
        }
        
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("load", handleFontSizeChange);
        window.removeEventListener("keydown", keydownHandler);
        window.removeEventListener("wheel", wheelHandler);
        
        if (rafId !== undefined) {
          cancelAnimationFrame(rafId);
        }
      };
    }
    // Return empty cleanup function if conditions are not met
    return () => {};
  }, [hasMounted, windowSize.width, fontSize]);

  return { windowSize, zoomLevel, ...responsiveFlags };
};

export default useWindowSize;
