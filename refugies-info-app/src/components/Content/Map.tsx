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

interface Props {
  map: MapGoogle;
  markersColor: string;
}
export const Map = (props: Props) => {
  const markers = props.map.markers;

  const onMarkerClick = (marker: MarkerGoogle) => {
    console.log("onmarker click", marker);
  };
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {markers.map((marker, key) => {
          return (
            <Marker
              key={key}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={() => onMarkerClick(marker)}
            >
              <Icon
                name="pin"
                fill={props.markersColor}
                width={40}
                height={40}
              />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};
