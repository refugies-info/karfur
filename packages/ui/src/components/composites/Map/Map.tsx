"use client";
import { Poi } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContext } from "./MapContext";
import { MapPanel } from "./MapPanel";

// Dynamically import LeafletMap component with SSR disabled
const DynamicLeafletMap = dynamic(() => import("./LeafletMap.tsx").then((mod) => mod.LeafletMap), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center">Chargement de la carte...</div>,
});

type MapProps = {
  className?: string;
  title?: string;
  description?: string;
  mapData: Poi[];
  defaultFocusedPoi?: Poi;
};

export const Map = ({ className, title, description, mapData, defaultFocusedPoi }: MapProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedPoi, setFocusedPoi] = useState<Poi | null>(null);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";

      // Handle escape key to exit fullscreen
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsFullscreen(false);
        }
      };
      window.addEventListener("keydown", handleEscKey);

      let styleEl = document.getElementById("map-fullscreen-styles");

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.setAttribute("id", "map-fullscreen-styles");
        styleEl.innerHTML = `
          .sticky, [class*='sticky'], [style*='position: sticky'], [style*='position:sticky'] {
            z-index: 1 !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Clean up escape key handler when component unmounts or fullscreen changes
      return () => {
        window.removeEventListener("keydown", handleEscKey);
      };
    }

    document.body.style.overflow = "";

    const existingStyle = document.getElementById("map-fullscreen-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    const resizeTimeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);

    return () => {
      clearTimeout(resizeTimeout);
      document.body.style.overflow = "";
      const existingStyle = document.getElementById("map-fullscreen-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isFullscreen]);

  const [focusOnMapFn, setFocusOnMapFn] = useState<((poi: Poi, zoomLevel?: number) => void) | undefined>(undefined);

  const handleMapReady = useCallback((fn: (poi: Poi, zoomLevel?: number) => void) => {
    setFocusOnMapFn(() => fn);
    return fn;
  }, []);

  const handleFocusLocation = useCallback(
    (poi: Poi, zoomLevel?: number) => {
      setFocusedPoi(poi);
      if (focusOnMapFn) {
        focusOnMapFn(poi, zoomLevel);
      }
    },
    [focusOnMapFn],
  );

  useEffect(() => {
    if (defaultFocusedPoi) {
      handleFocusLocation(defaultFocusedPoi);
    }
  }, [defaultFocusedPoi]);

  const contextValue = useMemo(
    () => ({
      isFullscreen,
      setIsFullscreen,
      focusLocation: handleFocusLocation,
      mapData,
      handleMapReady,
      title,
      description,
      focusedPoi,
    }),
    [isFullscreen, handleFocusLocation, mapData, handleMapReady, title, description, focusedPoi],
  );

  return mapData ? (
    <MapContext.Provider value={contextValue}>
      <div
        className={cn(
          "shadow-ri bg-white max-md:flex max-md:flex-col lg:grid lg:grid-cols-2 print:shadow-none",
          !isFullscreen && "lg:h-100",
          isFullscreen && "fixed inset-0 top-0 left-0 z-[9999] lg:grid-cols-4",
          className,
        )}
      >
        <MapPanel />
        <DynamicLeafletMap className={cn("grid max-lg:min-h-128 max-md:h-[60vh]", isFullscreen && "lg:col-span-3")} />
      </div>
    </MapContext.Provider>
  ) : (
    <p>Pas de données de carte</p>
  );
};

Map.displayName = "Map";
