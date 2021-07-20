import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { MapGoogle, MarkerGoogle } from "../../types/interface";
import { Icon } from "react-native-eva-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
  },
});

interface PropsType {
  map: MapGoogle;
  markersColor: string;
}

interface StateType {}

const DEFAULT_PADDING = { top: 50, right: 50, bottom: 50, left: 50 };
export class Map extends React.Component<PropsType, StateType> {
  componentDidMount() {
    if (this.props.map.markers.length > 0) {
      this.fitAllMarkers();
    }
  }
  onMarkerClick = (marker: MarkerGoogle) => {
    console.log("onmarker click", marker);
  };

  fitAllMarkers() {
    // @ts-ignore
    this.map.fitToCoordinates(this.props.map.markers, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  render() {
    const markers = this.props.map.markers;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 47,
            longitude: 2,
            latitudeDelta: 10,
            longitudeDelta: 5,
          }}
          ref={(ref) => {
            // @ts-ignore
            this.map = ref;
          }}
        >
          {markers.map((marker, key) => {
            return (
              <Marker
                key={key}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={() => this.onMarkerClick(marker)}
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
      </View>
    );
  }
}
