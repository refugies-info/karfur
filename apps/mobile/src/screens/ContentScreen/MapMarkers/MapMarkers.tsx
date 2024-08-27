import { Id, Poi } from "@refugies-info/api-types";
import React, { useCallback, useMemo, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import {
  FixSafeAreaView,
  Icon,
  IconButton,
  Map,
  MiniMap,
  RTLView,
  ReadableText,
  TextDSFR_MD_Bold,
  TextDSFR_XL,
} from "~/components";
import { useTranslationWithRTL } from "~/hooks";
import { styles } from "~/theme";
import { MapGoogle } from "~/types/interface";
import { PropsOf } from "~/utils";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";

const HeaderText = styled(TextDSFR_XL)`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;
const FakeMapButton = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.white};
  justify-content: center;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.radius * 3}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  width: auto;
  height: 56px;
  padding-horizontal: ${({ theme }) => theme.radius * 3}px;
`;
const FakeMapButtonText = styled(TextDSFR_MD_Bold)`
  margin-left: ${({ theme }) => (!theme.i18n.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
`;
const ModalContainer: React.FC<React.PropsWithChildren<PropsOf<typeof View>>> = ({ children, ...other }) => {
  const insets = useSafeAreaInsets();
  const Component = styled.View<{ paddingTop: number }>`
    display: flex;
    position: absolute;
    width: 100%;
    padding-horizontal: ${({ theme }) => theme.margin * 2}px;
    padding-top: ${({ paddingTop }) => paddingTop}px;
    z-index: 2;
    flex-direction: row;
    justify-content: space-between;
  `;
  return (
    <Component paddingTop={insets.top} {...other}>
      {children}
    </Component>
  );
};

interface Props {
  markers: Poi[] | null;
  contentId: Id;
  color: string;
}

export const MapMarkers = ({ markers, contentId, color }: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const mapGoogle: MapGoogle = useMemo(
    () => ({
      markers: (markers || []).map((poi: Poi, index) => ({
        address: poi.address,
        email: poi.email,
        latitude: poi.lat,
        longitude: poi.lng,
        nom: poi.title,
        telephone: poi.phone,
        vicinity: poi.city,
        description: poi.description,
        place_id: index.toString(),
      })),
    }),
    [markers],
  );

  const toggleMap = useCallback(() => {
    if (!contentId) return;
    setMapModalVisible(!mapModalVisible);
    logEventInFirebase(FirebaseEvent.CLIC_SEE_MAP, { contentId });
  }, [contentId, mapModalVisible]);

  if (!mapGoogle || mapGoogle.markers.length === 0) return null;
  return (
    <>
      <HeaderText key={1} color={color} accessibilityRole="header">
        <ReadableText>{t("content_screen.where", "Trouver un interlocuteur")}</ReadableText>
      </HeaderText>
      <MiniMap map={mapGoogle} markersColor={color}>
        <TouchableOpacity
          onPress={toggleMap}
          accessibilityLabel={t("content_screen.see_map_button")}
          testID="test-button-map"
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FakeMapButton accessible={false}>
            <Icon color={styles.colors.black} name="eye-outline" size={24} />
            <FakeMapButtonText isRTL={isRTL}>{t("content_screen.see_map_button", "Voir la carte")}</FakeMapButtonText>
          </FakeMapButton>
        </TouchableOpacity>
      </MiniMap>

      <Modal visible={mapModalVisible} animationType="slide">
        <FixSafeAreaView>
          <ModalContainer>
            <IconButton
              accessibilityLabel={t("content_screen.back_content_accessibility")}
              iconName="arrow-back-outline"
              onPress={toggleMap}
            />
            <IconButton
              accessibilityLabel={t("content_screen.close_map_accessibility")}
              iconName="close-outline"
              onPress={toggleMap}
            />
          </ModalContainer>
        </FixSafeAreaView>
        <Map map={mapGoogle} markersColor={color} />
      </Modal>
    </>
  );
};
