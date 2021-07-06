import React from "react";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { Flag } from "./Flag";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { setCurrentLanguageActionCreator } from "../../services/redux/User/user.actions";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";
import {
  currentI18nCodeSelector,
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { AvailableLanguageI18nCode } from "../../types/interface";

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
  margin-right: ${(props: { isRTL: any }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-left: ${(props: { isRTL: any }) => (props.isRTL ? theme.margin : 0)}px;

  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 1;
`;

const ButtonContainerFixedWidth = styled.TouchableOpacity`
  width: 48px;
  margin-right: ${theme.margin}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 1;
`;

const LanguageContainer = styled(ButtonContainerCommon)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  width: 48px;
`;

const FlagBackground = styled.View`
  margin: 4px;
  background-color: ${theme.colors.white};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

interface Props {
  selectedLanguageI18nCode?: AvailableLanguageI18nCode | null;
  currentLanguageI18nCode?: AvailableLanguageI18nCode | null;
  onLongPressSwitchLanguage?: () => void;
}

export const LanguageSwitch = ({ onLongPressSwitchLanguage }: Props) => {
  const { i18n } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  const selectedLanguage = getSelectedLanguageFromI18nCode(
    selectedLanguageI18nCode
  );
  const isFrenchSelected = currentLanguageI18nCode === "fr";

  const dispatch = useDispatch();

  const changeLanguage = (
    isFrenchSelected: boolean,
    selectedLanguageI18nCode: AvailableLanguageI18nCode
  ) => {
    if (isFrenchSelected) {
      i18n.changeLanguage(selectedLanguageI18nCode);
      return dispatch(
        setCurrentLanguageActionCreator(selectedLanguageI18nCode)
      );
    }
    i18n.changeLanguage("fr");
    return dispatch(setCurrentLanguageActionCreator("fr"));
  };
  if (!selectedLanguageI18nCode || !currentLanguageI18nCode) return <View />;

  if (selectedLanguageI18nCode === "fr")
    return (
      <ButtonContainerFixedWidth onPress={onLongPressSwitchLanguage}>
        <Flag langueFr={"Français"} />
      </ButtonContainerFixedWidth>
    );
  return (
    <ButtonContainer
      onPress={() => changeLanguage(isFrenchSelected, selectedLanguageI18nCode)}
      isRTL={false}
      onLongPress={onLongPressSwitchLanguage}
    >
      <LanguageContainer
        backgroundColor={
          isFrenchSelected ? theme.colors.darkBlue : theme.colors.white
        }
      >
        <FlagBackground>
          <Flag langueFr={"Français"} />
        </FlagBackground>
      </LanguageContainer>
      <LanguageContainer
        backgroundColor={
          isFrenchSelected ? theme.colors.white : theme.colors.darkBlue
        }
      >
        <FlagBackground>
          <Flag langueFr={selectedLanguage.langueFr} />
        </FlagBackground>
      </LanguageContainer>
    </ButtonContainer>
  );
};
