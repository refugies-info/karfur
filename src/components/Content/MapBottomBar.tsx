import React from "react";
import styled from "styled-components/native";
import { View, TouchableOpacity, Alert } from "react-native";
import { MarkerGoogle } from "../../types/interface";
import { TextSmallNormal } from "../StyledText";
import { RTLView, RTLTouchableOpacity } from "../BasicComponents";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { MapContentFromHtml } from "./MapContentHtml";
import { Icon } from "react-native-eva-icons";
import * as Linking from "expo-linking";

interface Props {
  selectedMarker: MarkerGoogle | null;
  textColor: string;
  hideSideBar: () => void;
}

export const callNumber = (phone: string) => {
  let phoneNumber = `tel:${phone}`;

  Linking.canOpenURL(phoneNumber).then((supported) => {
    if (!supported) {
      Alert.alert("Phone number is not available");
    } else {
      return Linking.openURL(phoneNumber);
    }
  });
};

const ICON_SIZE = 24;

const MainContainer = styled.View`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.margin * 3 : 0}px;
`;

const ContentContainer = styled(RTLView)`
  margin-bottom: ${(props: { marginBottom: number }) =>
    props.marginBottom !== undefined
      ? theme.margin * props.marginBottom
      : theme.margin}px;
  margin-top: ${(props: { marginTop: number }) =>
    props.marginTop !== undefined
      ? theme.margin * props.marginTop
      : theme.margin}px;
  align-items: flex-start;
`;

const ContentTouchableOpacity = styled(RTLTouchableOpacity)`
  margin-bottom: ${(props: { marginBottom: number }) =>
    props.marginBottom !== undefined
      ? theme.margin * props.marginBottom
      : theme.margin}px;
  margin-top: ${(props: { marginTop: number }) =>
    props.marginTop !== undefined
      ? theme.margin * props.marginTop
      : theme.margin}px;
  align-items: flex-start;
`;

const TextValue = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin}px;
  color: ${(props: { color: string }) => props.color};
`;
const TextIcon = styled(Icon)`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;

const CloseContainer = styled(TouchableOpacity)`
  background-color: ${theme.colors.black};
  height: 40px;
  width: 40px;
  border-radius: 20px;
  align-self: center;
  margin-top: ${theme.margin * 4}px;
  margin-bottom: ${theme.margin * 2}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const HTMLContainer = styled.View`
  flex-grow: 0;
  flex-shrink: 1;
`;

export const MapBottomBar = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  if (!props.selectedMarker) {
    return <MainContainer isSelected={false} />;
  }
  const formattedMarkerName =
    props.selectedMarker && props.selectedMarker.nom
      ? props.selectedMarker.nom.replace("<br>", "")
      : "";
  return (
    <MainContainer isSelected={true}>
      <View>
        <ContentContainer
          color={props.textColor}
          marginBottom={4}
          marginTop={0}
        >
          <HTMLContainer>
            <MapContentFromHtml
              htmlContent={formattedMarkerName}
              darkColor={props.textColor}
              isBold={true}
              isLarge={true}
            />
          </HTMLContainer>
        </ContentContainer>

        <ContentContainer marginTop={0}>
          <TextIcon
            name="pin-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
          />
          <HTMLContainer>
            <TextValue color={props.textColor}>
              {props.selectedMarker.address}
            </TextValue>
          </HTMLContainer>
        </ContentContainer>

        <ContentContainer color={props.textColor} marginTop={0}>
          <TextIcon
            name="at-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
          />
          <HTMLContainer>
            {props.selectedMarker.email ? (
              <MapContentFromHtml
                htmlContent={props.selectedMarker.email}
                darkColor={props.textColor}
                isBold={false}
              />
            ) : (
              <TextValue color={props.textColor}>
                {t("Content.Non renseigné", "Non renseigné")}
              </TextValue>
            )}
          </HTMLContainer>
        </ContentContainer>

        <ContentTouchableOpacity
          color={props.textColor}
          marginTop={0}
          onPress={() => {
            if (props.selectedMarker && props.selectedMarker.telephone) {
              callNumber(props.selectedMarker.telephone);
            }
          }}
        >
          <TextIcon
            name="phone-outline"
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={props.textColor}
            isRTL={isRTL}
          />
          <HTMLContainer>
            {props.selectedMarker.telephone ? (
              <MapContentFromHtml
                htmlContent={props.selectedMarker.telephone}
                darkColor={props.textColor}
                isBold={false}
              />
            ) : (
              <TextValue color={props.textColor}>
                {t("Content.Non renseigné", "Non renseigné")}
              </TextValue>
            )}
          </HTMLContainer>
        </ContentTouchableOpacity>

        {!!props.selectedMarker.description && (
          <>
            <ContentContainer color={props.textColor} marginTop={4}>
              <TextIcon
                name="info-outline"
                width={ICON_SIZE}
                height={ICON_SIZE}
                fill={props.textColor}
                isRTL={isRTL}
              />
              <HTMLContainer>
                <MapContentFromHtml
                  htmlContent={props.selectedMarker.description}
                  darkColor={props.textColor}
                  isBold={false}
                />
              </HTMLContainer>
            </ContentContainer>
          </>
        )}
      </View>
      <CloseContainer onPress={props.hideSideBar}>
        <Icon
          name={"close-outline"}
          height={24}
          width={24}
          fill={theme.colors.white}
        />
      </CloseContainer>
    </MainContainer>
  );
};
