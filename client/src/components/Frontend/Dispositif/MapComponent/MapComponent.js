import React from "react";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";

import { colors } from "colors";

const { compose, withProps } = require("recompose");
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
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    ref={props.onMapMounted}
    zoom={props.zoom}
    center={props.center}
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
          <React.Fragment key={key}>
            <Marker
              position={{
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude),
              }}
              onClick={(e) => props.onMarkerClick(e, marker, key)}
            ></Marker>
          </React.Fragment>
        );
      })}
  </GoogleMap>
));

export default mapComponent;
