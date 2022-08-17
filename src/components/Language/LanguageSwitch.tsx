import React from "react";
import { styles } from "../../theme";
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
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { newReadingList } from "../../services/redux/VoiceOver/voiceOver.actions";

const ButtonContainerCommon = styled.View`
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  margin-right: ${(props: { isRTL: any }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-left: ${(props: { isRTL: any }) => (props.isRTL ? styles.margin : 0)}px;

  background-color: ${styles.colors.grey60};
  border-radius: ${styles.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${styles.shadows.lg}
`;

const ButtonContainerFixedWidth = styled.TouchableOpacity`
  width: 48px;
  margin-right: ${styles.margin}px;
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${styles.shadows.lg}
`;

const LanguageContainer = styled(ButtonContainerCommon)`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? styles.colors.white : styles.colors.grey60 };
  width: 48px;
  ${(props: { isSelected: boolean }) => props.isSelected ? `
  z-index: 3;
  ` : "" }
`;

const FlagBackground = styled.View`
  margin: 4px;
  background-color: ${styles.colors.white};
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
  const { t, i18n } = useTranslationWithRTL();
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

  const onSwitchPress = () => {
    const newLanguage = isFrenchSelected ? selectedLanguageI18nCode : "fr";
    const oldLanguage = isFrenchSelected ? "fr" : selectedLanguageI18nCode;
    logEventInFirebase(FirebaseEvent.SWITCH_LANGUAGE, {
      newLanguageOldLanguage: newLanguage + "/" + oldLanguage,
    });
    dispatch(newReadingList(null));
    changeLanguage(isFrenchSelected, selectedLanguageI18nCode);
  };

  if (selectedLanguageI18nCode === "fr")
    return (
      <ButtonContainerFixedWidth
        onPress={onLongPressSwitchLanguage}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={t("global.change_language_accessibility")}
      >
        <Flag langueFr={"Français"} />
      </ButtonContainerFixedWidth>
    );
  return (
    <ButtonContainer
      onPress={onSwitchPress}
      isRTL={false}
      onLongPress={onLongPressSwitchLanguage}
      accessibilityRole="button"
      accessibilityLabel={t("global.change_language_accessibility")}
      activeOpacity={0.8}
    >
      <LanguageContainer
        isSelected={isFrenchSelected}
      >
        <FlagBackground>
          <Flag langueFr={"Français"} />
        </FlagBackground>
      </LanguageContainer>
      <LanguageContainer
        isSelected={!isFrenchSelected}
      >
        <FlagBackground>
          <Flag langueFr={selectedLanguage.langueFr} />
        </FlagBackground>
      </LanguageContainer>
    </ButtonContainer>
  );
};
