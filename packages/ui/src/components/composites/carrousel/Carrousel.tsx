import { Button } from "@codegouvfr/react-dsfr/Button";
import { cn } from "@refugies-info/ui";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

type CarrouselTexts = {
  title?: string | null;
  seeMore?: string;
  prev?: string;
  next?: string;
  countSeparator?: string;
};

const defaultTexts: Required<CarrouselTexts> = {
  title: null,
  seeMore: "Voir plus",
  prev: "Faire défiler à gauche",
  next: "Faire défiler à droite",
  countSeparator: "sur",
};

type CarrouselProps = {
  texts?: CarrouselTexts;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  seeMoreUrl?: string;
  dir?: "ltr" | "rtl";
  enableContainerPadding?: boolean;
  onSlidePrev?: (targetSlide: number) => void;
  onSlideNext?: (targetSlide: number) => void;
  onSlideChange?: (currentSlide: number) => void;
};

// Define the handle type for the imperative handle
export type CarrouselHandle = {
  scrollToSlide: (targetSlide: number, useSmooth?: boolean) => void;
};

export const Carrousel = forwardRef<CarrouselHandle, CarrouselProps>(
  (
    {
      texts,
      children,
      className,
      containerClassName,
      seeMoreUrl,
      dir = "ltr",
      enableContainerPadding = true,
      onSlidePrev,
      onSlideNext,
      onSlideChange,
    }: CarrouselProps,
    ref,
  ) => {
    const scrollContainerRef = useRef<HTMLUListElement>(null);
    const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
    const componentId = useId();

    const t: Required<CarrouselTexts> = useMemo(
      () => ({
        ...defaultTexts,
        ...texts,
      }),
      [texts],
    );

    // Initialize refs array when children change
    useEffect(() => {
      slideRefs.current = slideRefs.current.slice(0, childrenArray.length);
    }, [childrenArray.length]);

    // Remove currentSlide from dependency array to prevent recreation on every slide change
    const handleScroll = useCallback(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let nearestIndex = 0;
      let minDistance = Infinity;

      slideRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const cardRect = ref.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== currentSlide) {
        setCurrentSlide(nearestIndex);
      }
    }, []);

    useEffect(() => {
      onSlideChange?.(currentSlide);
    }, [currentSlide]);

    const checkScrollability = useCallback(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;

      const isRtl = dir === "rtl";

      let hasReachedStart, hasReachedEnd;

      if (isRtl) {
        hasReachedStart = container.scrollLeft > -10; // Close to 0 (right edge)
        hasReachedEnd = Math.abs(container.scrollLeft) >= container.scrollWidth - container.clientWidth - 10; // Close to max negative (left edge)
      } else {
        hasReachedStart = container.scrollLeft < 10; // Close to 0 (left edge)
        hasReachedEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10; // Close to max (right edge)
      }

      setCanScrollNext(!hasReachedEnd); // Can scroll "next" (left) if not at left edge
      setCanScrollPrev(!hasReachedStart); // Can scroll "prev" (right) if not at right edge
    }, [dir]);

    const scrollToSlide = useCallback(
      (targetSlide: number, useSmooth = true) => {
        if (targetSlide < 0 || targetSlide >= childrenArray.length) return;
        if (!scrollContainerRef.current || !slideRefs.current[targetSlide]) return;

        const slideElement = slideRefs.current[targetSlide];
        const containerElement = scrollContainerRef.current;

        // Calculate the scroll position manually to account for the padding
        const containerRect = containerElement.getBoundingClientRect();
        const slideRect = slideElement.getBoundingClientRect();

        // Calculate the position to center the slide in the container
        const scrollLeft =
          slideElement.offsetLeft - containerElement.offsetLeft - (containerRect.width / 2 - slideRect.width / 2);

        // Scroll to the calculated position
        containerElement.scrollTo({
          left: scrollLeft,
          behavior: useSmooth ? "smooth" : "auto",
        });

        setCurrentSlide(targetSlide);
      },
      [childrenArray.length],
    );

    // Expose the scrollToSlide function via ref
    useImperativeHandle(
      ref,
      () => ({
        scrollToSlide,
      }),
      [scrollToSlide],
    );

    const { prevSlide, nextSlide } = useMemo(
      () => ({
        prevSlide: Math.max(0, currentSlide - 1),
        nextSlide: Math.min(childrenArray.length - 1, currentSlide + 1),
      }),
      [currentSlide, childrenArray.length],
    );

    const handlePrevClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const targetSlide = Math.max(0, currentSlide - 1);
        scrollToSlide(targetSlide, true);
        onSlidePrev?.(targetSlide);
      },
      [currentSlide, scrollToSlide],
    );

    const handleNextClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const targetSlide = Math.min(childrenArray.length - 1, currentSlide + 1);
        scrollToSlide(targetSlide, true);
        onSlideNext?.(targetSlide);
      },
      [currentSlide, childrenArray.length, scrollToSlide],
    );

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Create throttled versions of our handlers to prevent excessive calls
      let isThrottled = false;
      const throttleTime = 100; // 100ms throttle
      let dragTimeout: ReturnType<typeof setTimeout>;

      const throttledHandleScroll = () => {
        if (isThrottled) return;
        isThrottled = true;

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
          handleScroll();
          setTimeout(() => {
            isThrottled = false;
          }, throttleTime);
        });
      };

      const handleResize = () => {
        checkScrollability();
      };

      // Handle scroll events with different strategies for drag vs normal scroll
      const handleScrollEvent = () => {
        // Clear any existing drag timeout
        clearTimeout(dragTimeout);

        // During drag, only update scrollability, not position
        checkScrollability();

        // Set timeout to detect end of dragging
        dragTimeout = setTimeout(() => {
          // Only calculate nearest slide when drag ends
          throttledHandleScroll();
        }, 150);
      };

      // Only use ResizeObserver if it's available in the browser
      let observer: ResizeObserver | undefined;
      if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(handleResize);
        observer.observe(container);
      }

      // Fallback to window resize event
      window.addEventListener("resize", handleResize);
      container.addEventListener("scroll", handleScrollEvent);

      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("scroll", handleScrollEvent);
        clearTimeout(dragTimeout);
      };
    }, [handleScroll, checkScrollability]);

    return (
      <section className={cn("relative w-full max-md:pb-14", className)} dir={dir}>
        <div className="container mx-auto mb-8 flex w-full gap-4 lg:justify-between">
          {t.title && (
            <h2 id={componentId} className="!mb-0 w-full !text-2xl font-bold max-sm:pe-[30%]">
              {t.title}
            </h2>
          )}
          <div className="z-10 flex items-center gap-2 max-md:absolute max-md:right-4 max-md:bottom-0">
            <Button
              aria-label={`${t.prev} (${prevSlide + 1} ${t.countSeparator} ${childrenArray.length})`}
              onClick={handlePrevClick}
              priority="tertiary"
              iconId={dir === "rtl" ? "fr-icon-arrow-right-line" : "fr-icon-arrow-left-line"}
              title={t.prev}
              disabled={!canScrollPrev}
            />
            <Button
              aria-label={`${t.next} (${nextSlide + 1} ${t.countSeparator} ${childrenArray.length})`}
              onClick={handleNextClick}
              disabled={!canScrollNext}
              priority="tertiary"
              iconId={dir === "rtl" ? "fr-icon-arrow-left-line" : "fr-icon-arrow-right-line"}
              title={t.next}
            />
            {seeMoreUrl && (
              <Button className="whitespace-nowrap" priority="tertiary" linkProps={{ href: seeMoreUrl }}>
                {t.seeMore}
              </Button>
            )}
          </div>
        </div>

        <ul
          ref={scrollContainerRef}
          className={cn(
            "carrousel noscrollbar m-auto flex list-none gap-4 p-0",
            "snap-x snap-mandatory overflow-x-auto scroll-smooth",
            "scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::WebkitScrollbar]:hidden",
            enableContainerPadding &&
              "scroll-ps-[max(1rem,calc((100vw-76rem)/2))] ps-[max(1rem,calc((100vw-76rem)/2))]",
            "ltr:pr-4 rtl:pl-4",
            containerClassName,
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            overscrollBehaviorX: "contain",
            direction: dir,
          }}
          aria-labelledby={t.title ? componentId : undefined}
          role="list"
        >
          {React.Children.map(children, (child, index) => (
            <li
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              id={`slide-${componentId}-${index}`}
              className="min-w-max shrink-0 snap-start"
              role="listitem"
            >
              {child}
            </li>
          ))}
        </ul>
      </section>
    );
  },
);

Carrousel.displayName = "Carrousel";
