import React from 'react';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

import variables from 'scss/colors.scss';
import Icon from 'react-eva-icons/dist/Icon';

const { compose, withProps } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const mapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_API_KEY + "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `470px`, width: "100%" }} />,
    mapElement: <div style={{ height: `100%`, width: "100%" }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    zoom={props.zoom}
    center={props.center}
    defaultZoom={5}
    defaultCenter={{ lat: 48.856614, lng: 2.3522219 }}
    defaultOptions={{
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl:false,
    }}
    onClick={props.onClose} >
    {!props.disableEdit && 
      <SearchBox
        ref={props.onSearchBoxMounted}
        controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={props.onPlacesChanged}
      >
        <div className="places-input-wrapper">
          <input
            type="text"
            placeholder="Placez ici vos lieux de contact"
            className="places-input"
            value={props.searchValue}
            onChange={props.handleChange} />
          <EVAIcon className="places-icon" name="search-outline" fill={variables.grisFonce} />
        </div>
      </SearchBox>}
    
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

export default mapComponent;