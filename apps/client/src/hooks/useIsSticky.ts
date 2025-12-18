import { type RefObject, useEffect, useState } from "react";

const useIsSticky = (ref: RefObject<HTMLElement | null>): boolean => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const cachedRef = ref.current;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([e]) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          setIsSticky(e.intersectionRatio < 1);
        }, 10);
      },
      {
        threshold: [1],
        rootMargin: "0px 0px 0px 0px",
      },
    );

    observer.observe(cachedRef);

    return () => {
      observer.unobserve(cachedRef);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [ref]);

  return isSticky;
};

export default useIsSticky;
