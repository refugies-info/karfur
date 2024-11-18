import { useEffect, useState } from "react";

let testElement: HTMLDivElement | null = null;
let instanceCount = 0;

const useStylesDisabled = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!testElement) {
      testElement = document.createElement("div");
      testElement.style.cssText = "position:absolute;visibility:hidden";
      testElement.className = "test-styles-enabled";
      document.body.appendChild(testElement);
    }
    instanceCount++;

    const checkStyles = () => {
      if (testElement) {
        const isStylesDisabled = window.getComputedStyle(testElement).color === "rgb(0, 0, 0)";
        setIsDisabled(isStylesDisabled);
      }
    };

    const observer = new ResizeObserver(checkStyles);
    observer.observe(testElement);

    checkStyles();

    return () => {
      observer.disconnect();
      instanceCount--;

      if (instanceCount === 0 && testElement) {
        testElement.remove();
        testElement = null;
      }
    };
  }, []);

  return isDisabled;
};

export default useStylesDisabled;
