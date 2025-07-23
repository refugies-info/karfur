"use client";
import { Poi } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import L, { LatLngBounds, LatLngTuple } from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import CustomControls from "./CustomControls";
import { useMapContext } from "./MapContext";
import PopupContent from "./PopupContent";

// Create a single marker icon with Tailwind classes to control its appearance
const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="relative w-full h-full marker-container group origin-bottom transition-all duration-250 ease-in-out [&.active]:scale-150">
      <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="fill-[#000091] group-[.active]:fill-[#1212FF] transition-all duration-250 ease-in-out" d="M18.364 17.3639L12 23.7279L5.636 17.3639C4.37734 16.1052 3.52019 14.5016 3.17293 12.7558C2.82567 11.0099 3.00391 9.20035 3.6851 7.55582C4.36629 5.91129 5.51984 4.50569 6.99988 3.51677C8.47992 2.52784 10.22 2 12 2C13.78 2 15.5201 2.52784 17.0001 3.51677C18.4802 4.50569 19.6337 5.91129 20.3149 7.55582C20.9961 9.20035 21.1743 11.0099 20.8271 12.7558C20.4798 14.5016 19.6227 16.1052 18.364 17.3639ZM12 12.9999C12.5304 12.9999 13.0391 12.7892 13.4142 12.4141C13.7893 12.0391 14 11.5304 14 10.9999C14 10.4695 13.7893 9.96078 13.4142 9.58571C13.0391 9.21064 12.5304 8.99992 12 8.99992C11.4696 8.99992 10.9609 9.21064 10.5858 9.58571C10.2107 9.96078 10 10.4695 10 10.9999C10 11.5304 10.2107 12.0391 10.5858 12.4141C10.9609 12.7892 11.4696 12.9999 12 12.9999Z"/>
      </svg>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, 0], // Position popup on the left side of the marker
});

L.Marker.prototype.options.icon = markerIcon;

type LeafletMapProps = {
  className?: string;
};

export const LeafletMap = ({ className }: LeafletMapProps): React.ReactElement => {
  const { mapData, handleMapReady, focusedPoi, focusLocation } = useMapContext();
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const { isMobile } = useWindowSize();

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([title, marker]) => {
      const markerElement = marker.getElement();
      if (markerElement) {
        const container = markerElement.querySelector(".marker-container");
        if (container) {
          if (title === activeMarker) {
            container.classList.add("active");
            marker.setOpacity(1);
          } else {
            container.classList.remove("active");
            marker.setOpacity(0.8);
          }
        }
      }
    });
  }, [activeMarker]);

  useEffect(() => {
    if (focusedPoi) {
      handleFocusLocation(focusedPoi);
    }
  }, [focusedPoi]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const handleFocusLocation = useCallback((poi: Poi, zoomLevel = 16) => {
    const map = mapRef.current;
    const marker = markersRef.current[poi.title];
    const clusterGroup = clusterGroupRef.current;

    if (!map || !marker) {
      return;
    }

    setActiveMarker(poi.title);

    const markerLatLng = marker.getLatLng();

    if (clusterGroup) {
      clusterGroup.zoomToShowLayer(marker, () => {
        map.once("moveend", () => {
          marker.openPopup();
        });
        map.flyTo(markerLatLng, zoomLevel, {
          animate: true,
          duration: 0.7,
          easeLinearity: 0.25,
        });
      });
    } else {
      map.once("moveend", () => {
        marker.openPopup();
      });
      map.flyTo(markerLatLng, zoomLevel, {
        animate: true,
        duration: 0.7,
        easeLinearity: 0.25,
      });
    }
  }, []);

  useEffect(() => {
    if (handleMapReady) {
      handleMapReady(handleFocusLocation);
    }
  }, [handleMapReady, handleFocusLocation]);

  const bounds = useMemo(
    () => (mapData.length > 0 ? new LatLngBounds(mapData.map((poi) => [poi.lat, poi.lng] as LatLngTuple)) : undefined),
    [mapData],
  );

  const center = useMemo<LatLngTuple>(
    () => (bounds ? [bounds.getCenter().lat, bounds.getCenter().lng] : [46.603354, 1.888334]),
    [bounds],
  );

  const handleMarkerClick = useCallback(
    (e: L.LeafletMouseEvent, poi: Poi) => {
      const map = mapRef.current;
      const marker = markersRef.current[poi.title];

      if (!map || !marker) return;

      e.originalEvent.stopPropagation();

      const focusAndNotify = () => {
        handleFocusLocation(poi);
        if (focusLocation) focusLocation(poi);
      };

      const visibleParent = clusterGroupRef.current?.getVisibleParent(marker);
      if (clusterGroupRef.current && visibleParent && visibleParent !== marker) {
        clusterGroupRef.current.zoomToShowLayer(marker, focusAndNotify);
      } else {
        focusAndNotify();
      }
    },
    [handleFocusLocation, focusLocation],
  );

  const popupEventHandlers = useMemo(
    () => ({
      add: (poi: Poi) => () => setActiveMarker(poi.title),
      remove: () => () => setActiveMarker(null),
    }),
    [],
  );

  const markers = useMemo(() => {
    return mapData.map((poi, i) => {
      const position: [number, number] = [poi.lat, poi.lng];

      return (
        <Marker
          key={`${poi.title}-${i}`}
          position={position}
          ref={(ref) => {
            if (ref && markersRef.current) markersRef.current[poi.title] = ref;
          }}
          opacity={0.8}
          eventHandlers={{
            click: (e) => handleMarkerClick(e, poi),
          }}
        >
          <Popup
            className="max-w-[300px] translate-y-[calc(100%_+15px)] [&_.leaflet-popup-content]:!max-w-[280px] [&_.leaflet-popup-tip-container]:!hidden [&_div]:!rounded-none"
            autoPan={false}
            eventHandlers={{
              add: popupEventHandlers.add(poi),
              remove: popupEventHandlers.remove(),
            }}
          >
            <PopupContent poi={poi} />
          </Popup>
        </Marker>
      );
    });
  }, [mapData, handleMarkerClick, popupEventHandlers]);

  return (
    <div className={className}>
      <MapContainer
        ref={mapRef}
        center={center}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        zoom={bounds ? undefined : 6}
        preferCanvas={true}
        renderer={L.canvas({ pane: "tilePane" })}
        fadeAnimation={false}
        zoomAnimation={true}
        markerZoomAnimation={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        dragging={isMobile ? false : true}
      >
        <CustomControls />
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_REACT_APP_STADIA_MAPS_API_KEY}`}
          minZoom={0}
          maxZoom={16}
          keepBuffer={12}
          updateWhenIdle={true}
          updateWhenZooming={true}
          maxNativeZoom={16}
          tileSize={256}
          attribution="&copy; <a href='https://www.stadiamaps.com/' target='_blank'>Stadia Maps</a> &copy; <a href='https://openmaptiles.org/' target='_blank'>OpenMapTiles</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <MarkerClusterGroup
          ref={clusterGroupRef}
          chunkedLoading
          maxClusterRadius={40}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
          showCoverageOnHover={false}
          disableClusteringAtZoom={16}
        >
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

LeafletMap.displayName = "LeafletMap";
