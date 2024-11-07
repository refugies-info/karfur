import { useEffect, useState } from "react";

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

  const isMobile = windowSize.width && windowSize.width <= baseFontSize * 48; // 768px
  const isTablet = windowSize.width && windowSize.width < baseFontSize * 61.5; // 992px

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    function handleFontSizeChange() {
      // Get the actual font size of the page
      const computedStyle = window.getComputedStyle(document.body);
      const fontSize = parseFloat(computedStyle.fontSize);
      setBaseFontSize(fontSize);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleFontSizeChange); // Check font size on page load
    window.addEventListener("zoom", handleFontSizeChange); // Check font size on zoom

    handleResize();
    handleFontSizeChange();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleFontSizeChange);
      window.removeEventListener("zoom", handleFontSizeChange);
    };
  }, []);

  return { windowSize, isMobile, isTablet };
};

export default useWindowSize;
