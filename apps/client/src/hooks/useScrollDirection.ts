import throttle from "lodash/throttle";
import { useEffect, useState } from "react";

export enum ScrollDirection {
  up = "up",
  down = "down",
}

export const useScrollDirection = (scrollLimit: number) => {
  const threshold = 100;
  const [scrollDir, setScrollDir] = useState(ScrollDirection.up);
  const [overScrollLimit, setOverScrollLimit] = useState(false);

  useEffect(() => {
    let previousScrollYPosition = window.scrollY;

    const scrolledMoreThanThreshold = (currentScrollYPosition: number) =>
      Math.abs(currentScrollYPosition - previousScrollYPosition) > threshold;

    const isScrollingUp = (currentScrollYPosition: number) =>
      currentScrollYPosition > previousScrollYPosition &&
      !(previousScrollYPosition > 0 && currentScrollYPosition === 0) &&
      !(currentScrollYPosition > 0 && previousScrollYPosition === 0);

    const updateScroll = () => {
      const currentScrollYPosition = window.scrollY;

      if (scrolledMoreThanThreshold(currentScrollYPosition)) {
        const newScrollDirection = isScrollingUp(currentScrollYPosition)
          ? ScrollDirection.down
          : ScrollDirection.up;
        setScrollDir(newScrollDirection);
        previousScrollYPosition =
          currentScrollYPosition > 0 ? currentScrollYPosition : 0;
      }

      if (currentScrollYPosition <= scrollLimit) setOverScrollLimit(false);
      else if (currentScrollYPosition >= scrollLimit) setOverScrollLimit(true);
    };

    const onScroll = throttle(() => window.requestAnimationFrame(updateScroll), 100);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollLimit]);

  return [scrollDir, overScrollLimit];
};
