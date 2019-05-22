import React from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"

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
    zoom={props.zoom}
    center={props.center}
    defaultZoom={5}
    defaultCenter={{ lat: 48.856614, lng: 2.3522219 }}
    onClick={props.onClose} >
    {props.markers && props.markers.length > 0 &&
      props.markers.map( (marker, key) =>  {
        if(props.isMarkerShown[key]){
          return (
            <React.Fragment key={key}>
              <Marker 
                position={{lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude)}} 
                onClick={(e) => props.onMarkerClick(e, marker, key)} >
                {props.showingInfoWindow[key] && 
                  <InfoWindow onClose={props.onClose} >
                    <div>
                      <h4>{marker.nom}</h4>
                      <span>{marker.description}</span>
                    </div>
                  </InfoWindow>
                }
              </Marker>
            </React.Fragment>
          )
        }else{return false}
      })
    }
  </GoogleMap>
)

export default map;