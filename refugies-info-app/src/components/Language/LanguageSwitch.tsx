import React, { useEffect } from "react";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { Flag } from "./Flag";
import { useSelector, useDispatch } from "react-redux";
import {
  selectedI18nCodeSelector,
  currentI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { Text, View } from "react-native";
import { activatedLanguages } from "../../data/languagesData";
import i18n from "../../services/i18n";
import { setCurrentLanguageActionCreator } from "../../services/redux/User/user.actions";

const ButtonContainerCommon = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  margin-right: ${theme.margin}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonContainerFixedWidth = styled(ButtonContainerCommon)`
  width: 48px;
`;

const LanguageContainer = styled(ButtonContainerFixedWidth)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
`;

const getSelectedLanguageLangueFrFromI18nCode = (i18nCode: string) => {
  const languageData = activatedLanguages.filter(
    (language) => language.i18nCode === i18nCode
  );
  if (languageData.length > 0) return languageData[0].langueFr;
  return "Français";
};

interface Props {
  selectedLanguageI18nCode: string | null;
  currentLanguageI18nCode: string | null;
}

export const LanguageSwitch = ({
  selectedLanguageI18nCode,
  currentLanguageI18nCode,
}: Props) => {
  if (!selectedLanguageI18nCode || !currentLanguageI18nCode) return <View />;

  const selectedLanguageLangueFr = getSelectedLanguageLangueFrFromI18nCode(
    selectedLanguageI18nCode
  );
  const isFrenchSelected = currentLanguageI18nCode === "fr";

  const dispatch = useDispatch();

  const changeLanguage = (
    isFrenchSelected: boolean,
    selectedLanguageI18nCode: string
  ) => {
    console.log("isFrenchSelected", isFrenchSelected);
    console.log("selectedLanguageI18nCode", selectedLanguageI18nCode);
    if (isFrenchSelected) {
      i18n.changeLanguage(selectedLanguageI18nCode);
      return dispatch(
        setCurrentLanguageActionCreator(selectedLanguageI18nCode)
      );
    }
    i18n.changeLanguage("fr");
    return dispatch(setCurrentLanguageActionCreator("fr"));
  };

  if (selectedLanguageI18nCode === "fr")
    return (
      <ButtonContainerFixedWidth>
        <Flag langueFr={"Français"} />
      </ButtonContainerFixedWidth>
    );
  return (
    <ButtonContainer
      onPress={() => changeLanguage(isFrenchSelected, selectedLanguageI18nCode)}
    >
      <LanguageContainer
        backgroundColor={
          isFrenchSelected ? theme.colors.darkBlue : theme.colors.white
        }
      >
        <Flag langueFr={"Français"} />
      </LanguageContainer>
      <LanguageContainer
        backgroundColor={
          isFrenchSelected ? theme.colors.white : theme.colors.darkBlue
        }
      >
        <Flag langueFr={selectedLanguageLangueFr} />
      </LanguageContainer>
    </ButtonContainer>
  );
};
