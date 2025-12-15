"use client";
import type { Poi } from "@refugies-info/api-types";
import { createContext, type RefObject, useContext } from "react";
import type { CarrouselHandle } from "../carrousel";

interface MapContextType {
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  focusLocation?: (poi: Poi, zoomLevel?: number) => void;
  mapData: Poi[];
  handleMapReady?: (fn: (poi: Poi) => void) => (poi: Poi) => void;
  title?: string;
  description?: string;
  focusedPoi?: Poi | null;
  carrouselRef?: RefObject<CarrouselHandle>;
}

export const MapContext = createContext<MapContextType>({
  isFullscreen: false,
  setIsFullscreen: () => {},
  mapData: [],
  handleMapReady: undefined,
  title: undefined,
  description: undefined,
  focusedPoi: null,
  carrouselRef: undefined,
});

export const useMapContext = () => useContext(MapContext);
