import { useCallback, useEffect, useState } from "react";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : undefined,
    height: typeof window !== "undefined" ? window.innerHeight : undefined,
  });
  const [baseFontSize, setBaseFontSize] = useState<number>(16);

  const isMobile = windowSize.width && windowSize.width <= baseFontSize * 48;
  const isTablet = windowSize.width && windowSize.width < baseFontSize * 61.5;

  const debounce = useCallback((fn: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastFontSize = baseFontSize;

    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    const handleFontSizeChange = debounce(() => {
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (fontSize !== lastFontSize) {
        lastFontSize = fontSize;
        setBaseFontSize(fontSize);
        rafId = requestAnimationFrame(handleResize);
      }
    }, 100);

    const debouncedFontSizeChange = debounce(handleFontSizeChange, 100);

    // Set up observers
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

    handleFontSizeChange();

    return () => {
      [resizeObserver, mutationObserver].forEach((observer) => observer.disconnect());
      ["resize", "load"].forEach((event) => window.removeEventListener(event, handleResize));
      clearTimeout(rafId);
    };
  }, [debounce, baseFontSize]);

  return { windowSize, isMobile, isTablet };
};

export default useWindowSize;
