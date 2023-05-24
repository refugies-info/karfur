import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, useJsApiLoader, MarkerF, InfoBox } from "@react-google-maps/api";
import { Poi } from "@refugies-info/api-types";
import { useEvent } from "hooks";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import PopupContent from "./PopupContent";
import Sidebar from "./Sidebar";
import styles from "./Map.module.scss";

export type Marker = Poi & { id: number };

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const Map = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const { Event } = useEvent();

  const [popup, setPopup] = useState<Marker | null>(null);
  const [maxZoom, setMaxZoom] = useState(12);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || "",
    libraries,
  });

  const markers = useMemo(() => {
    if (!dispositif?.map || dispositif.map?.length === 0) return [];
    return dispositif.map.map((marker, i) => ({ ...marker, id: i }));
  }, [dispositif]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      for (const marker of markers) {
        if (!!marker.lat && !!marker.lng) {
          bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
        }
      }

      map.fitBounds(bounds);
      setMap(map);

      setTimeout(() => {
        setMaxZoom(25);
      }, 500);
    },
    [markers],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const selectMarker = useCallback(
    (marker: Marker) => {
      setPopup(marker);
      map?.setCenter({ lat: marker.lat, lng: marker.lng });
      Event("DISPO_VIEW", "click marker", "Map");
    },
    [map, Event],
  );

  return (
    <div className={styles.container}>
      <Sidebar markers={markers} onSelectMarker={selectMarker} selectedMarkerId={popup?.id || null} />

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={markers.length === 0 ? { lat: 48.856614, lng: 2.3522219 } : undefined}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={() => setPopup(null)}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            maxZoom: maxZoom,
            controlSize: 32,
          }}
        >
          {markers.map((marker, key) => (
            <MarkerF
              key={key}
              position={{
                lat: marker.lat,
                lng: marker.lng,
              }}
              icon={{
                url: "/images/map/pin.svg",
                anchor: new google.maps.Point(30, 42),
              }}
              onClick={() => selectMarker(marker)}
            ></MarkerF>
          ))}

          {popup && (
            <InfoBox
              position={new google.maps.LatLng(popup.lat, popup.lng)}
              options={{
                closeBoxURL: "",
                pixelOffset: new google.maps.Size(-120, 10), // half of the PopupContent width
                boxClass: styles.popup,
              }}
            >
              <PopupContent marker={popup} onClose={() => setPopup(null)} />
            </InfoBox>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
