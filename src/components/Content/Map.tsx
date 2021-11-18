import React, { useState, useMemo, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Dimensions } from "react-native";
import BottomSheet, {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { MapGoogle, MarkerGoogle } from "../../types/interface";
import { Icon } from "react-native-eva-icons";
import { MapBottomBar } from "./MapBottomBar";
import { theme } from "../../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface PropsType {
  map: MapGoogle;
  markersColor: string;
}

export const Map = (props: PropsType) => {
  let map: MapView | null = null;
  let bottomSheet: BottomSheet | null = null;

  // Bottom sheet
  const [markerOpen, setMarkerOpen] = useState<MarkerGoogle | null>(null);
  const onMarkerClick = (marker: MarkerGoogle, e: any) => {
    e.stopPropagation();
    setMarkerOpen(marker);
  };
  const hideMarkerDetails = () => {
    setMarkerOpen(null);
  };
  const onChange = (index: number) => {
    if (index === -1) setMarkerOpen(null);
  };

  useEffect(() => {
    if (bottomSheet) {
      if (markerOpen === null) {
        bottomSheet.close();
      } else {
        bottomSheet.expand();

        if (map) {
          map.fitToCoordinates([
            {
              // use custom marker positions to set padding around real marker
              latitude: markerOpen.latitude + 0.005,
              longitude: markerOpen.longitude,
            },
            {
              latitude: markerOpen.latitude,
              longitude: markerOpen.longitude,
            },
            {
              latitude: markerOpen.latitude - 0.02,
              longitude: markerOpen.longitude,
            },
          ]);
        }
      }
    }
  }, [markerOpen]);

  // Initial zoom
  const [maxZoom, setMaxZoom] = useState(13); // fix for initial zoom
  const fitAllMarkers = (markers: MarkerGoogle[]) => {
    if (!map) return;
    map.fitToCoordinates(markers, {
      animated: false,
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
    setTimeout(() => {
      setMaxZoom(20); // reset zoom to max level
    }, 100);
  };

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const markers = props.map.markers;
  const mapHeight = Dimensions.get("window").height;
  const mapWidth = Dimensions.get("window").width;

  return (
    <GestureHandlerRootView>
      <MapView
        ref={(ref) => (map = ref)}
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
        onPress={hideMarkerDetails}
        onMapReady={() => fitAllMarkers(markers)}
        maxZoomLevel={maxZoom}
        provider={PROVIDER_GOOGLE}
      >
        {markers.map((marker, key) => {
          return (
            <Marker
              key={key}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={(e: any) => onMarkerClick(marker, e)}
              accessibilityRole="button"
            >
              <Icon
                name="pin"
                fill={
                  markerOpen?.place_id === marker.place_id
                    ? theme.colors.red
                    : props.markersColor
                }
                width={40}
                height={40}
              />
            </Marker>
          );
        })}
      </MapView>
      <BottomSheet
        index={0}
        ref={(ref) => (bottomSheet = ref)}
        enablePanDownToClose={true}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        onChange={onChange}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <MapBottomBar
            selectedMarker={markerOpen}
            textColor={props.markersColor}
            hideSideBar={hideMarkerDetails}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
