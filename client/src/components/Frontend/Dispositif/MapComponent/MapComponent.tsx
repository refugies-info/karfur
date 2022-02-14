import React, { useCallback } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import styles from "./MapComponent.module.scss";

interface Props {
  onClose: any;
  disableEdit: boolean;
  onSearchBoxMounted: any;
  onPlacesChanged: any;
  searchValue: string;
  handleChange: any;
  markers: any[];
  onMarkerClick: any;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const MapComponent = (props: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || "",
    libraries
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    (props.markers || []).forEach((child: any) => {
      if (child.type === Marker) {
        bounds.extend(
          new window.google.maps.LatLng(
            child.latitude,
            child.longitude
          )
        );
      }
    });
    map.fitBounds(bounds);
  }, [props.markers]);

  const onUnmount = useCallback(function callback() { }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: 470 }}
      center={{ lat: 48.856614, lng: 2.3522219 }}
      zoom={5}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      }}
      onClick={props.onClose}
    >
      {!props.disableEdit && (
        <StandaloneSearchBox
          onLoad={props.onSearchBoxMounted}
          onPlacesChanged={props.onPlacesChanged}
        >
          <div className={styles.places}>
            <input
              type="text"
              placeholder="Ajoutez un nouveau lieu"
              className={styles.input}
              value={props.searchValue}
              onChange={props.handleChange}
            />
            <EVAIcon
              className={styles.icon}
              name="search-outline"
              fill={colors.grisFonce}
            />
          </div>
        </StandaloneSearchBox>
      )}

      {(props.markers || []).map((marker, key) => {
          return (
            <Marker
              key={key}
              position={{
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude),
              }}
              onClick={(e) => props.onMarkerClick(e, marker, key)}
            ></Marker>
          );
        })}
    </GoogleMap>
  ) : (
    <></>
  );
};
export default MapComponent;
