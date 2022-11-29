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
import { styles } from "../../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface PropsType {
  map: MapGoogle;
  markersColor: string;
}

export const Map = (props: PropsType) => {
  let map: MapView | null = null;
  let bottomSheet: BottomSheet | null = null;

  const { t } = useTranslationWithRTL();

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

        const lat =
          typeof markerOpen.latitude === "string"
            ? parseFloat(markerOpen.latitude)
            : markerOpen.latitude;
        const lng =
          typeof markerOpen.longitude === "string"
            ? parseFloat(markerOpen.longitude)
            : markerOpen.longitude;

        if (map) {
          map.fitToCoordinates([
            {
              // use custom marker positions to set padding around real marker
              latitude: lat + 0.005,
              longitude: lng,
            },
            {
              latitude: lat,
              longitude: lng,
            },
            {
              latitude: lat - 0.02,
              longitude: lng,
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
  const mapHeight = Dimensions.get("screen").height;
  const mapWidth = Dimensions.get("screen").width;

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
          const lat =
            typeof marker.latitude === "string"
              ? parseFloat(marker.latitude)
              : marker.latitude;
          const lng =
            typeof marker.longitude === "string"
              ? parseFloat(marker.longitude)
              : marker.longitude;
          return (
            <Marker
              key={key}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              onPress={(e: any) => onMarkerClick(marker, e)}
              accessibilityRole="button"
              accessibilityLabel={t(
                "content_screen.place_informations_accessibility"
              )}
            >
              <Icon
                name="pin"
                fill={
                  markerOpen?.place_id === marker.place_id
                    ? styles.colors.red
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
