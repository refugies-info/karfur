import * as React from "react";
import styled from "styled-components/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Dimensions } from "react-native";
import { MapGoogle } from "../../types/interface";
import { Icon } from "react-native-eva-icons";
import { theme } from "../../theme";

interface PropsType {
  map: MapGoogle;
  markersColor: string;
}

interface StateType {}

const MainContainer = styled.View`
  border-radius: ${theme.radius * 2}px;
  margin-horizontal: ${theme.margin * 3}px;
  overflow: hidden;
`;
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
  elevation: 2;
`;

export class MiniMap extends React.Component<PropsType, StateType> {
  render() {
    const markers = this.props.map.markers;
    const mapHeight = 240;
    const mapWidth = Dimensions.get("window").width - theme.margin * 2 * 3;

    return (
      <MainContainer>
        <ContentContainer>{this.props.children}</ContentContainer>
        <MapView
          provider={PROVIDER_GOOGLE}
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
          {markers.map((marker, key) => {
            const lat = typeof marker.latitude === "string"
              ? parseFloat(marker.latitude)
              : marker.latitude;
            const lng = typeof marker.longitude === "string"
              ? parseFloat(marker.longitude)
              : marker.longitude;
            return (
              <Marker
                key={key}
                coordinate={{
                  latitude: lat,
                  longitude: lng
                }}
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
      </MainContainer>
    );
  }
}
