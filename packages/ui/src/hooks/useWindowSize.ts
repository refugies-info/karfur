import { debounce } from "lodash";
import { useEffect, useState } from "react";

// TODO: update the client app to import this hook from @refugies-info/ui
// Helper function to check if we're in a browser environment
const isInBrowser = () => typeof window !== "undefined";

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
      window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && ["+", "-", "0", "="].includes(e.key)) {
          handleFontSizeChange();
        }
      });
      window.addEventListener("wheel", (e) => e.ctrlKey && handleFontSizeChange());

      return () => {
        [resizeObserver, mutationObserver].forEach((observer) => observer.disconnect());
        ["resize", "load"].forEach((event) => window.removeEventListener(event, handleResize));
        window.removeEventListener("keydown", handleFontSizeChange);
        window.removeEventListener("wheel", handleFontSizeChange);
        clearTimeout(rafId);
      };
    }
    // Return empty cleanup function if conditions are not met
    return () => {};
  }, [hasMounted, windowSize.width, fontSize]);

  return { windowSize, ...responsiveFlags };
};

export default useWindowSize;
