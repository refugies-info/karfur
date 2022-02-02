import React from "react";
import { compose, withProps } from "recompose"
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./MapComponent.module.scss";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");


interface InjectedProps {
  zoomToMarkers: any
}

interface PropsBeforeInjection {
  onClose: any
  disableEdit: boolean
  onSearchBoxMounted: any
  onPlacesChanged: any
  searchValue: string
  handleChange: any
  markers: any[]
  onMarkerClick: any
}

export interface Props extends PropsBeforeInjection, InjectedProps {}

const MapComponent = compose<Props, PropsBeforeInjection>(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "470px", width: "100%" }} />,
    mapElement: <div style={{ height: "100%", width: "100%" }} />,
    zoomToMarkers: (map: any) => {
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        if (map.props.children[1]) {
          map.props.children[1].forEach((child: any) => {
            if (child.type === Marker) {
              bounds.extend(
                new window.google.maps.LatLng(
                  child.props.position.lat,
                  child.props.position.lng
                )
              );
            }
          });
          if (map.props.children[1].length > 1) {
            map.fitBounds(bounds);
          }
        }
      }
    },
  }),
  withScriptjs,
  withGoogleMap
)((props: Props) => (
  <GoogleMap
    ref={props.zoomToMarkers}
    defaultZoom={5}
    defaultCenter={{ lat: 48.856614, lng: 2.3522219 }}
    defaultOptions={{
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    }}
    onClick={props.onClose}
  >
    {!props.disableEdit && (
      <SearchBox
        ref={props.onSearchBoxMounted}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <div>
          <input
            type="text"
            placeholder="Ajoutez un nouveau lieu"
            className={styles.places_input}
            value={props.searchValue}
            onChange={props.handleChange}
          />
          <EVAIcon
            className={styles.places_icon}
            name="search-outline"
            fill={colors.grisFonce}
          />
        </div>
      </SearchBox>
    )}

    {props.markers &&
      props.markers.length > 0 &&
      props.markers.map((marker, key) => {
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
));

export default MapComponent;
