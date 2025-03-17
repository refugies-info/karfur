import { Button } from "@codegouvfr/react-dsfr/Button";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

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
  className?: string;
  seeMoreUrl?: string;
};

export const Carrousel = ({ texts, children, className, seeMoreUrl }: CarrouselProps) => {
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
    },
    [currentSlide, scrollToSlide],
  );

  const handleNextClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const targetSlide = Math.min(childrenArray.length - 1, currentSlide + 1);
      scrollToSlide(targetSlide, true);
    },
    [currentSlide, childrenArray.length, scrollToSlide],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (currentSlide > 0) {
            scrollToSlide(currentSlide - 1, false);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentSlide < childrenArray.length - 1) {
            scrollToSlide(currentSlide + 1, false);
          }
          break;
      }
    },
    [currentSlide, childrenArray.length, scrollToSlide],
  );

  return (
    <section
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
        className={cn(
          "noscrollbar m-auto flex gap-4 pr-4",
          "touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth",
          "scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::WebkitScrollbar]:hidden",
          "scroll-pl-[max(1rem,calc((100vw-76rem)/2))] pl-[max(1rem,calc((100vw-76rem)/2))]", // Keep only the padding-left, remove scroll-padding-left
        )}
        aria-live="polite"
        aria-atomic="true"
        style={{
          "scrollbarWidth": "none",
          "msOverflowStyle": "none",
          "WebkitOverflowScrolling": "touch",
          "willChange": "transform",
          "scrollSnapType": "x mandatory",
          "scrollBehavior": "smooth",
          "touchAction": "pan-x",
          "overscrollBehaviorX": "contain",
          "cursor": "grab",
          // @ts-ignore
          "&:active": { cursor: "grabbing" },
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
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
};

Carrousel.displayName = "Carrousel";
