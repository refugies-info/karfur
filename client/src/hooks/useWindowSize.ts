import { useState, useEffect } from "react";

type WindowSize = {
  width: number | undefined
  height: number | undefined
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });
  const isMobile = windowSize.width && windowSize.width <= 768;

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { windowSize, isMobile };
}

export default useWindowSize;
