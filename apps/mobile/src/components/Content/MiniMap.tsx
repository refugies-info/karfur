import * as React from "react";
import { Dimensions, Platform } from "react-native";
import { Icon } from "react-native-eva-icons";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import styled from "styled-components/native";
import { styles } from "~/theme";
import { MapGoogle } from "~/types/interface";

interface Props {
  children: React.ReactNode;
  map: MapGoogle;
  markersColor: string;
}

const MainContainer = styled.View`
  ${styles.shadows.lg};
`;
const MapViewContainer = styled.View`
  border-radius: ${styles.radius * 2}px;
  overflow: hidden;
  ${styles.shadows.lg};
`; // repeat shadow to work with ios and android
const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  elevation: 8;
`; // need elevation to show button

const mapHeight = 240;
export const MiniMap = (props: Props) => {
  const mapWidth = Dimensions.get("window").width - styles.margin * 2 * 3;

  return (
    <MainContainer>
      <ContentContainer>{props.children}</ContentContainer>
      <MapViewContainer>
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
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
        >
          {props.map.markers.map((marker, key) => {
            const lat = typeof marker.latitude === "string" ? parseFloat(marker.latitude) : marker.latitude;
            const lng = typeof marker.longitude === "string" ? parseFloat(marker.longitude) : marker.longitude;
            return (
              <Marker
                key={key}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
              >
                <Icon name="pin" fill={props.markersColor} width={40} height={40} />
              </Marker>
            );
          })}
        </MapView>
      </MapViewContainer>
    </MainContainer>
  );
};
