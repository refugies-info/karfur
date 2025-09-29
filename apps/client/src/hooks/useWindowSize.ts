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
    if (hasMounted && isInBrowser()) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      
      if (isFirefox) {
        const defaultFontSize = 16;
        const currentZoom = Math.round((fontSize / defaultFontSize) * 100);
        setZoomLevel(currentZoom);
      } else {
        const isHiDPI = window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)').matches;
        
        let currentZoom;
        if (isHiDPI) {
          currentZoom = Math.round((window.devicePixelRatio / 2) * 100);
        } else {
          currentZoom = Math.round(window.devicePixelRatio * 100);
        }
        
        setZoomLevel(currentZoom);
      }
    }
  }, [fontSize, hasMounted, windowSize]);

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

    // Mark as mounted and set initial size
    setHasMounted(true);
    if (isInBrowser()) {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      checkResponsiveFlags();
    }

    let rafId: number;

    const handleResize = debounce(() => {
      if (!isInBrowser()) return;

      // Use innerWidth for accurate window size detection
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      checkResponsiveFlags();
    }, 100);

    const handleFontSizeChange = debounce(() => {
      if (!isInBrowser()) return;
      const newFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (newFontSize !== fontSize) {
        setFontSize(newFontSize);
        rafId = requestAnimationFrame(handleResize);
      }
    }, 100);

    const debouncedFontSizeChange = debounce(handleFontSizeChange, 100);

    // Set up observers if in browser environment
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

      // Initial calculations
      handleResize();
      handleFontSizeChange();

      // Attach observers and event listeners
      resizeObserver.observe(document.documentElement);
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
      mutationObserver.observe(document.head, { childList: true, subtree: true });

      window.addEventListener("resize", handleResize);
      window.addEventListener("load", handleFontSizeChange);
      const keydownHandler = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && ["+", "-", "0", "="].includes(e.key)) {
          handleFontSizeChange();
        }
      };
      
      const wheelHandler = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          handleFontSizeChange();
        }
      };
      
      window.addEventListener("keydown", keydownHandler);
      window.addEventListener("wheel", wheelHandler);
      
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      
      const chromeZoomHandler = () => {
        if (!isFirefox && isInBrowser()) {
          const isHiDPI = window.matchMedia && window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)').matches;
          
          let currentZoom;
          if (isHiDPI) {
            currentZoom = Math.round((window.devicePixelRatio / 2) * 100);
          } else {
            currentZoom = Math.round(window.devicePixelRatio * 100);
          }
          
          setZoomLevel(currentZoom);
        }
      };
      
      if (!isFirefox) {
        window.addEventListener("resize", chromeZoomHandler);
      }
      
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
        
        if (!isFirefox) {
          window.removeEventListener("resize", chromeZoomHandler);
        }
        
        if (rafId !== undefined) {
          cancelAnimationFrame(rafId);
        }
      };
    }
    // Return empty cleanup function if conditions are not met
    return () => {};
  }, [hasMounted, windowSize.width, fontSize]);

  return { windowSize, ...responsiveFlags };
};

export default useWindowSize;
