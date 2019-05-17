import React from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={6}
    defaultCenter={{ lat: 48.856614, lng: 2.3522219 }}
  >
    {props.isMarkerShown && props.markers && props.markers.length > 0 &&
      props.markers.map( (marker, key) =>  (
        <Marker position={marker} onClick={props.onMarkerClick} key={key} />
      ))
    }
  </GoogleMap>
)

export default map;