import * as React from "react";
import styled from "styled-components/native";
import { MarkerGoogle } from "../../types/interface";
import { TextSmallNormal, TextNormalBold, TextNormal } from "../StyledText";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { CustomButton } from "../CustomButton";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  selectedMarker: MarkerGoogle | null;
  height: number;
  width: number;
  textColor: string;
  hideSideBar: () => void;
}

const MainContainer = styled.View`
  background-color: ${theme.colors.white};
  width: ${(props: { isSelected: boolean; width: number }) =>
    props.isSelected ? props.width : 0}px;
  height: ${(props: { height: number }) => props.height}px;
  display: flex;
  flex-direction: column;

  position: absolute;
`;

const CategoryText = styled(TextSmallNormal)`
  color: ${theme.colors.grey60};
`;

const BoldValueText = styled(TextNormalBold)`
  color: ${(props: { color: string }) => props.color};
  margin-bottom: ${theme.margin}px;
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
        <BoldValueText color={props.textColor}>
          {props.selectedMarker.nom}
        </BoldValueText>
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
            <TextValue color={props.textColor}>
              {props.selectedMarker.description}
            </TextValue>
          </>
        )}
        <CategoryText>
          {t("Content.Email de contact", "Email de contact")}
        </CategoryText>
        <TextValue color={props.textColor}>
          {props.selectedMarker.email ||
            t("Content.Non renseigné", "Non renseigné")}
        </TextValue>
        <CategoryText>
          {t("Content.Numéro de téléphone", "Numéro de téléphone")}
        </CategoryText>
        <TextValue color={props.textColor}>
          {props.selectedMarker.telephone ||
            t("Content.Non renseigné", "Non renseigné")}
        </TextValue>
        <View style={{ marginTop: 8 }}>
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
