import { debounce } from "lodash";
import { useEffect, useState } from "react";
import isInBrowser from "~/lib/isInBrowser";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined, // Initialize as undefined for SSR to avoid hydration errors
    height: undefined, // Initialize as undefined for SSR to avoid hydration errors
  });
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [hasMounted, setHasMounted] = useState(false);

  // Calculate responsive flags only after mounting to avoid hydration mismatch
  const isMobile = hasMounted && windowSize.width ? windowSize.width <= baseFontSize * 48 : false;
  const isTablet = hasMounted && windowSize.width ? windowSize.width < baseFontSize * 61.5 : false;

  useEffect(() => {
    // Mark as mounted
    setHasMounted(true);

    let rafId: number;
    let lastFontSize = baseFontSize;

    const handleResize = debounce(() => {
      // Use screen.width for more accurate device width detection
      setWindowSize({
        width: window.screen.width, // Use screen.width for more accurate device width detection
        height: window.screen.height, // Use screen.height for more accurate device height detection
      });
    }, 100);

    const handleFontSizeChange = debounce(() => {
      if (!isInBrowser()) return;

      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (fontSize !== lastFontSize) {
        lastFontSize = fontSize;
        setBaseFontSize(fontSize);
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
        clearTimeout(rafId);
      };
    }
    // Return empty cleanup function if conditions are not met
    return () => {};
  }, [baseFontSize]);

  return { windowSize, isMobile, isTablet };
};

export default useWindowSize;
