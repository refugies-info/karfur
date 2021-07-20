import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Dimensions } from "react-native";
import { MapGoogle, MarkerGoogle } from "../../types/interface";
import { Icon } from "react-native-eva-icons";
import { MapSideBar } from "./MapSideBar";

interface PropsType {
  map: MapGoogle;
  markersColor: string;
}

interface StateType {
  markerOpen: MarkerGoogle | null;
}

export class Map extends React.Component<PropsType, StateType> {
  state: StateType = {
    markerOpen: null,
  };

  onMarkerClick = (marker: MarkerGoogle, e: any) => {
    e.stopPropagation();
    this.setState({ markerOpen: marker });
  };

  hideMarkerDetails = () => {
    this.setState({ markerOpen: null });
  };

  render() {
    const markers = this.props.map.markers;
    const mapHeight = Dimensions.get("window").height * 0.6;
    const mapWidth = Dimensions.get("window").width;

    return (
      <View>
        <MapView
          style={{
            width: mapWidth,
            height: mapHeight,
          }}
          initialRegion={{
            latitude: 47,
            longitude: 2,
            latitudeDelta: 10,
            longitudeDelta: 5,
          }}
          onPress={this.hideMarkerDetails}
        >
          {markers.map((marker, key) => {
            return (
              <Marker
                key={key}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={(e: any) => this.onMarkerClick(marker, e)}
              >
                <Icon
                  name="pin"
                  fill={this.props.markersColor}
                  width={40}
                  height={40}
                />
              </Marker>
            );
          })}
        </MapView>
        <MapSideBar
          selectedMarker={this.state.markerOpen}
          height={mapHeight}
          width={0.8 * mapWidth}
          textColor={this.props.markersColor}
          hideSideBar={this.hideMarkerDetails}
        />
      </View>
    );
  }
}
