"use client";
import { Carrousel, cn } from "@refugies-info/ui";
import { useCallback, useEffect, useMemo } from "react";
import { useWindowSize } from "@refugies-info/ui";
import { useMapContext } from "./MapContext";
import MapPanelItem from "./MapPanelItem";

type MapPanelProps = {
  className?: string;
};

export const MapPanel = ({ className }: MapPanelProps) => {
  const { mapData, title, description, focusedPoi, focusLocation, carrouselRef } = useMapContext();
  const { isMobile, isTablet } = useWindowSize();

  // Scroll to the selected POI when focusedPoi changes
  useEffect(() => {
    if (focusedPoi) {
      const index = mapData.findIndex((poi) => poi.title === focusedPoi.title);

      if (index !== -1) {
        if ((isMobile || isTablet) && carrouselRef?.current) {
          carrouselRef.current.scrollToSlide(index);
        }
      }
    }
  }, [focusedPoi, mapData, isMobile, isTablet]);
  const handleSlideChange = useCallback(
    (currentSlide: number) => {
      focusLocation?.(mapData[currentSlide]);
    },
    [focusLocation, mapData],
  );

  const mobileItems = useMemo(() => {
    return mapData.map((poi, i) => (
      <MapPanelItem className="h-full w-[80vw] max-w-96" key={`${poi.title}-${i}`} id={`${poi.title}-${i}`} poi={poi} />
    ));
  }, [mapData]);

  const desktopItems = useMemo(() => {
    return mapData.map((poi, i) => <MapPanelItem key={`${poi.title}-${i}`} id={`${poi.title}-${i}`} poi={poi} />);
  }, [mapData]);

  return (
    mapData && (
      <div className={cn("max-h-full w-full pt-10 pb-4 lg:overflow-y-auto lg:pb-10", className)}>
        {title && <h2 className="text-title-lg mb-3 px-4 lg:px-10">{title}</h2>}
        {description && <p className="px-4 max-sm:mb-0 lg:px-10">{description}</p>}
        {isMobile || isTablet ? (
          <Carrousel
            ref={carrouselRef}
            enableContainerPadding={false}
            onSlideChange={handleSlideChange}
            containerClassName="scroll-ps-4 ps-4"
          >
            {mobileItems}
          </Carrousel>
        ) : (
          <div className="flex flex-col gap-2 lg:px-10">{desktopItems}</div>
        )}
      </div>
    )
  );
};

MapPanel.displayName = "MapPanel";
