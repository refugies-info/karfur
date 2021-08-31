import * as React from "react";
import styled from "styled-components/native";
import { MarkerGoogle } from "../../types/interface";
import { TextSmallNormal, TextNormal } from "../StyledText";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { CustomButton } from "../CustomButton";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MapContentFromHtml } from "./MapContentHtml";

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
`;

const CategoryText = styled(TextSmallNormal)`
  color: ${theme.colors.grey60};
`;

const ContentContainer = styled.View`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin / 2}px;
`;

const TextValue = styled(TextNormal)`
  margin-bottom: ${theme.margin}px;
  color: ${(props: { color: string }) => props.color};
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
  return (
    <MainContainer isSelected={true} height={props.height} width={props.width}>
      <ScrollView
        contentContainerStyle={{
          padding: theme.margin * 3,
        }}
      >
        <CategoryText>
          {t("Content.Titre du lieu", "Titre du lieu")}
        </CategoryText>
        <ContentContainer color={props.textColor}>
          <MapContentFromHtml
            htmlContent={props.selectedMarker.nom}
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
        <View style={{ marginTop: theme.margin * 2 }}>
          <CustomButton
            defaultText="Ok"
            i18nKey="Ok"
            textColor={theme.colors.white}
            onPress={props.hideSideBar}
            backgroundColor={theme.colors.formation80}
          />
        </View>
      </ScrollView>
    </MainContainer>
  );
};
