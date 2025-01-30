import { cn } from "@/lib/cn";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@codegouvfr/react-dsfr/Button";

type CarrouselTexts = {
  title?: string | null;
  seeMore?: string;
  prev?: string;
  next?: string;
};

const defaultTexts: Required<CarrouselTexts> = {
  title: null,
  seeMore: "Voir plus",
  prev: "Faire défiler à gauche",
  next: "Faire défiler à droite",
};

type CarrouselProps = {
  texts?: CarrouselTexts;
  children: React.ReactNode;
  ref?: React.ForwardedRef<HTMLElement>;
  className?: string;
  seeMoreUrl?: string;
};

const areEqual = (prevProps: Omit<CarrouselProps, "ref">, nextProps: Omit<CarrouselProps, "ref">) => {
  return (
    prevProps.children === nextProps.children && JSON.stringify(prevProps.texts) === JSON.stringify(nextProps.texts)
  );
};

const CarrouselBase = forwardRef<HTMLElement, Omit<CarrouselProps, "ref">>(
  ({ texts, children, className, seeMoreUrl }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
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
    }, [currentSlide]);

    const checkScrollability = useCallback(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const hasReachedEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1; // -1 for rounding errors
      const hasReachedStart = container.scrollLeft <= 0;
      setCanScrollNext(!hasReachedEnd);
      setCanScrollPrev(!hasReachedStart);
    }, []);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleResize = () => {
        handleScroll();
        checkScrollability();
      };

      // Only use ResizeObserver if it's available in the browser
      let observer: ResizeObserver | undefined;
      if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(handleResize);
        observer.observe(container);
      }

      // Fallback to window resize event
      window.addEventListener("resize", handleResize);
      container.addEventListener("scroll", handleResize);

      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("scroll", handleResize);
      };
    }, [handleScroll, checkScrollability]);

    const scrollToSlide = useCallback(
      (targetSlide: number) => {
        if (targetSlide === 0 || targetSlide === childrenArray.length - 1) return;
        if (!scrollContainerRef.current || !slideRefs.current[targetSlide]) return;
        const slideElement = slideRefs.current[targetSlide];
        const containerElement = scrollContainerRef.current;
        const containerRect = containerElement.getBoundingClientRect();
        const containerCenter = containerRect.width / 2;
        const slideRect = slideElement.getBoundingClientRect();
        const slideOffset = slideRect.left - containerRect.left;
        const slideCenter = slideOffset + slideRect.width / 2;
        const scrollAdjustment = slideCenter - containerCenter;

        containerElement.scrollBy({
          left: scrollAdjustment,
          behavior: "smooth",
        });

        setCurrentSlide(targetSlide);
      },
      [childrenArray.length],
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
        scrollToSlide(targetSlide);
      },
      [currentSlide, scrollToSlide],
    );

    const handleNextClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const targetSlide = Math.min(childrenArray.length - 1, currentSlide + 1);
        scrollToSlide(targetSlide);
      },
      [currentSlide, childrenArray.length, scrollToSlide],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            if (currentSlide > 0) {
              scrollToSlide(currentSlide - 1);
            }
            break;
          case "ArrowRight":
            e.preventDefault();
            if (currentSlide < childrenArray.length - 1) {
              scrollToSlide(currentSlide + 1);
            }
            break;
        }
      },
      [currentSlide, childrenArray.length, scrollToSlide],
    );

    return (
      <section
        ref={ref}
        className={cn("relative w-full max-md:pb-14", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={t.title || "Carousel de contenu"}
        onKeyDown={handleKeyDown}
      >
        <div className="container mx-auto mb-8 flex w-full gap-4 lg:justify-between">
          {t.title && <h2 className="!mb-0 w-full !text-2xl font-bold max-sm:pr-[30%]">{t.title}</h2>}
          <nav className="z-10 flex items-center gap-2 max-md:absolute max-md:right-4 max-md:bottom-0">
            <Button
              aria-label={`${t.prev} (${prevSlide + 1} / ${childrenArray.length}`}
              onClick={handlePrevClick}
              priority="tertiary"
              iconId="fr-icon-arrow-left-line"
              title={t.prev}
              disabled={!canScrollPrev}
            />
            <Button
              aria-label={`${t.next} (${nextSlide + 1} / ${childrenArray.length}`}
              onClick={handleNextClick}
              disabled={!canScrollNext}
              priority="tertiary"
              iconId="fr-icon-arrow-right-line"
              title={t.next}
            />
            {seeMoreUrl && (
              <Button className="whitespace-nowrap" priority="tertiary" linkProps={{ href: seeMoreUrl }}>
                {t.seeMore}
              </Button>
            )}
          </nav>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide z-1 m-auto flex touch-pan-x snap-x snap-mandatory scroll-ps-[max(0.75rem,calc((100vw-33.75rem)/2+0.5rem))] gap-4 overflow-x-auto scroll-smooth pr-4 pl-[max(0.75rem,calc((100vw-33.75rem)/2+0.5rem))] [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-ps-[max(0.75rem,calc((100vw-45rem)/2+0.5rem))] sm:pl-[max(0.75rem,calc((100vw-45rem)/2+0.5rem))] lg:scroll-ps-[max(0.75rem,calc((100vw-60rem)/2+0.5rem))] lg:pl-[max(0.75rem,calc((100vw-60rem)/2+0.5rem))] xl:scroll-ps-[max(0.75rem,calc((100vw-78rem)/2+1rem))] xl:pl-[max(0.75rem,calc((100vw-78rem)/2+1rem))] [&::-webkit-scrollbar]:hidden"
          aria-live="polite"
          aria-atomic="true"
          style={{
            "scrollbarWidth": "none",
            "msOverflowStyle": "none",
            "WebkitOverflowScrolling": "touch",
            "willChange": "transform",
            // @ts-ignore
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              ref={(el) => (slideRefs.current[index] = el)}
              id={`slide-${index}`}
              className="min-w-max shrink-0 snap-start"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} sur ${childrenArray.length}`}
              tabIndex={0}
              aria-current={currentSlide === index ? "true" : undefined}
            >
              {child}
            </div>
          ))}
        </div>
      </section>
    );
  },
);

CarrouselBase.displayName = "Carrousel";

export const Carrousel = React.memo(CarrouselBase, areEqual);
