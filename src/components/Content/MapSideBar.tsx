import * as React from "react";
import styled from "styled-components/native";
import { MarkerGoogle } from "../../types/interface";
import { TextVerySmallNormal, TextSmallNormal } from "../StyledText";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MapContentFromHtml } from "./MapContentHtml";
import { Icon } from "react-native-eva-icons";

interface Props {
  selectedMarker: MarkerGoogle | null;
  height: number;
  width: number;
  textColor: string;
  hideSideBar: () => void;
  windowWidth: number;
}

const MainContainer = styled.View`
  background-color: ${theme.colors.white};
  width: ${(props: { isSelected: boolean; width: number }) =>
    props.isSelected ? props.width : 0}px;
  height: ${(props: { height: number }) => props.height}px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  padding: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.margin * 2 : 0}px;
`;

const CategoryText = styled(TextVerySmallNormal)`
  color: ${theme.colors.darkGrey};
`;

const ContentContainer = styled.View`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin / 2}px;
`;

const TextValue = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin}px;
  color: ${(props: { color: string }) => props.color};
`;

const CloseContainer = styled(TouchableOpacity)`
  background-color: ${theme.colors.black};
  height: 40px;
  width: 40px;
  border-radius: 20px;
  align-self: center;
  margin-top: ${theme.margin * 2}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MapSideBar = (props: Props) => {
  const { t } = useTranslationWithRTL();

  if (!props.selectedMarker) {
    return (
      <MainContainer
        isSelected={false}
        height={props.height}
        width={props.width}
      />
    );
  }
  const formattedMarkerName =
    props.selectedMarker && props.selectedMarker.nom
      ? props.selectedMarker.nom.replace("<br>", "")
      : "";
  return (
    <MainContainer isSelected={true} height={props.height} width={props.width}>
      <View>
        <CategoryText>
          {t("Content.Titre du lieu", "Titre du lieu")}
        </CategoryText>
        <ContentContainer color={props.textColor}>
          <MapContentFromHtml
            htmlContent={formattedMarkerName}
            windowWidth={props.windowWidth}
            darkColor={props.textColor}
            isBold={true}
          />
        </ContentContainer>
        <CategoryText>{t("Content.Adresse", "Adresse")}</CategoryText>
        <TextValue color={props.textColor}>
          {props.selectedMarker.address}
        </TextValue>
        <CategoryText>{t("Content.Ville", "Ville")}</CategoryText>
        <TextValue color={props.textColor}>
          {props.selectedMarker.vicinity}
        </TextValue>
        {!!props.selectedMarker.description && (
          <>
            <CategoryText>
              {t("Content.Informations pratiques", "Informations pratiques")}
            </CategoryText>
            <ContentContainer color={props.textColor}>
              <MapContentFromHtml
                htmlContent={props.selectedMarker.description}
                windowWidth={props.windowWidth}
                darkColor={props.textColor}
                isBold={false}
              />
            </ContentContainer>
          </>
        )}
        <CategoryText>
          {t("Content.Email de contact", "Email de contact")}
        </CategoryText>
        {props.selectedMarker.email ? (
          <ContentContainer color={props.textColor}>
            <MapContentFromHtml
              htmlContent={props.selectedMarker.email}
              windowWidth={props.windowWidth}
              darkColor={props.textColor}
              isBold={false}
            />
          </ContentContainer>
        ) : (
          <TextValue color={props.textColor}>
            {t("Content.Non renseigné", "Non renseigné")}
          </TextValue>
        )}
        <CategoryText>
          {t("Content.Numéro de téléphone", "Numéro de téléphone")}
        </CategoryText>
        {props.selectedMarker.telephone ? (
          <ContentContainer color={props.textColor}>
            <MapContentFromHtml
              htmlContent={props.selectedMarker.telephone}
              windowWidth={props.windowWidth}
              darkColor={props.textColor}
              isBold={false}
            />
          </ContentContainer>
        ) : (
          <TextValue color={props.textColor}>
            {t("Content.Non renseigné", "Non renseigné")}
          </TextValue>
        )}

        <CloseContainer onPress={props.hideSideBar}>
          <Icon
            name={"close-outline"}
            height={24}
            width={24}
            fill={theme.colors.white}
          />
        </CloseContainer>
      </View>
    </MainContainer>
  );
};
