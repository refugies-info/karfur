import { RefObject, useEffect, useState } from "react";

const useIsSticky = (ref: RefObject<HTMLElement>): boolean => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1);
      },
      {
        threshold: [1],
        rootMargin: "-10px 0px 0px 0px", // Accounts for 1px of scroll
      },
    );

    observer.observe(cachedRef);

    return () => {
      observer.unobserve(cachedRef);
    };
  }, [ref]);

  return isSticky;
};

export default useIsSticky;
