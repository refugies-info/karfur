import React from "react";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { Flag } from "./Flag";
import { useSelector } from "react-redux";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { Text, View } from "react-native";
import { activatedLanguages } from "../../data/languagesData";

const ButtonContainerCommon = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.margin}px;
`;

const ButtonContainer = styled(ButtonContainerCommon)``;

const ButtonContainerFr = styled(ButtonContainerCommon)`
  width: 48px;
`;

const getSelectedLanguageLangueFrFromI18nCode = (i18nCode: string) => {
  const languageData = activatedLanguages.filter(
    (language) => language.i18nCode === i18nCode
  );
  if (languageData.length > 0) return languageData[0].langueFr;
  return "Français";
};

export const LanguageSwitch = () => {
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  if (!selectedLanguageI18nCode) return <View />;

  const selectedLanguageLangueFr = getSelectedLanguageLangueFrFromI18nCode(
    selectedLanguageI18nCode
  );

  if (selectedLanguageI18nCode === "fr")
    return (
      <ButtonContainerFr>
        <Flag langueFr={"Français"} />
      </ButtonContainerFr>
    );

  return (
    <ButtonContainer>
      <Flag langueFr={"Français"} />
      <Flag langueFr={selectedLanguageLangueFr} />
    </ButtonContainer>
  );
};
