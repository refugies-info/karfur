import React from "react";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { Flag } from "./Flag";
import { useDispatch } from "react-redux";
import { View } from "react-native";
import i18n from "../../services/i18n";
import { setCurrentLanguageActionCreator } from "../../services/redux/User/user.actions";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";

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
`;

const ButtonContainerFixedWidth = styled(ButtonContainerCommon)`
  width: 48px;
`;

const LanguageContainer = styled(ButtonContainerFixedWidth)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
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
  selectedLanguageI18nCode?: string | null;
  currentLanguageI18nCode?: string | null;
  onLongPressSwitchLanguage?: () => void;
}

export const LanguageSwitch = ({
  selectedLanguageI18nCode,
  currentLanguageI18nCode,
  onLongPressSwitchLanguage,
}: Props) => {
  if (!selectedLanguageI18nCode || !currentLanguageI18nCode) return <View />;

  const selectedLanguage = getSelectedLanguageFromI18nCode(
    selectedLanguageI18nCode
  );
  const isFrenchSelected = currentLanguageI18nCode === "fr";

  const dispatch = useDispatch();

  const changeLanguage = (
    isFrenchSelected: boolean,
    selectedLanguageI18nCode: string
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

  if (selectedLanguageI18nCode === "fr")
    return (
      <ButtonContainerFixedWidth>
        <Flag langueFr={"Français"} />
      </ButtonContainerFixedWidth>
    );
  return (
    <ButtonContainer
      onPress={() => changeLanguage(isFrenchSelected, selectedLanguageI18nCode)}
      isRTL={i18n.isRTL()}
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
