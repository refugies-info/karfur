import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Dimensions, Modal } from "react-native";
import { MapGoogle, MarkerGoogle } from "../../types/interface";
import { Icon } from "react-native-eva-icons";
import { MapBottomBar } from "./MapBottomBar";
import { theme } from "../../theme";

interface PropsType {
  map: MapGoogle;
  markersColor: string;
  windowWidth: number;
}

interface StateType {
  markerOpen: MarkerGoogle | null;
  maxZoom: number;
}

export class Map extends React.Component<PropsType, StateType> {
  state: StateType = {
    markerOpen: null,
    maxZoom: 13, // fix for initial zoom
  };
  map: MapView | null = null;

  onMarkerClick = (marker: MarkerGoogle, e: any) => {
    e.stopPropagation();
    this.setState({ markerOpen: marker });
  };

  hideMarkerDetails = () => {
    this.setState({ markerOpen: null });
  };

  fitAllMarkers = (markers: MarkerGoogle[]) => {
    if (!this.map) return;
    this.map.fitToCoordinates(markers, {
      animated: false,
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
    this.setState({ maxZoom: 20 }); // reset zoom to max level
  }

  render() {
    const markers = this.props.map.markers;
    const mapHeight = Dimensions.get("window").height;
    const mapWidth = Dimensions.get("window").width;

    return (
      <View>
        <MapView
          ref={ref => this.map = ref}
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
          onMapReady={() => this.fitAllMarkers(markers)}
          maxZoomLevel={this.state.maxZoom}
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
                  fill={this.state.markerOpen?.place_id === marker.place_id ? theme.colors.red : this.props.markersColor}
                  width={40}
                  height={40}
                />
              </Marker>
            );
          })}
        </MapView>
        <Modal
          visible={!!this.state.markerOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={this.hideMarkerDetails}
        >
          <MapBottomBar
            selectedMarker={this.state.markerOpen}
            height={0.8 * mapHeight}
            width={mapWidth}
            textColor={this.props.markersColor}
            hideSideBar={this.hideMarkerDetails}
            windowWidth={this.props.windowWidth}
          />
        </Modal>
      </View>
    );
  }
}
