import { RefObject, useEffect, useState } from "react";

const useIsSticky = (ref: RefObject<HTMLElement>): boolean => {
  const [isSticky, setIsSticky] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
          setIsSticky(e.intersectionRatio < 1);
        }, 10);
        setTimeoutId(id);
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
  }, [ref, timeoutId]);

  return isSticky;
};

export default useIsSticky;
