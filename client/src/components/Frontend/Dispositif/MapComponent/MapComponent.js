import React from "react";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";

import { colors } from "colors";

const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const {
  SearchBox,
} = require("react-google-maps/lib/components/places/SearchBox");
const mapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.REACT_APP_GOOGLE_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "470px", width: "100%" }} />,
    mapElement: <div style={{ height: "100%", width: "100%" }} />,
  }),
  lifecycle({
    componentWillMount() {
      this.setState({
        zoomToMarkers: (map) => {
          if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            if (map.props.children[1]) {
              map.props.children[1].forEach((child) => {
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
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
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
        <div className="places-input-wrapper">
          <input
            type="text"
            placeholder="Ajoutez un nouveau lieu"
            className="places-input"
            value={props.searchValue}
            onChange={props.handleChange}
          />
          <EVAIcon
            className="places-icon"
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

export default mapComponent;
