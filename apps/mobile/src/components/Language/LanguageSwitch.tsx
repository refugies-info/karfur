import { Languages } from "@refugies-info/api-types";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getSelectedLanguageFromI18nCode } from "~/libs/language";
import { setCurrentLanguageActionCreator } from "~/services/redux/User/user.actions";
import { currentI18nCodeSelector, selectedI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";
import { Flag } from "./Flag";

const ButtonContainerCommon = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.grey60};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.shadows.lg}
`;

const ButtonContainerFixedWidth = styled.TouchableOpacity`
  width: 48px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.shadows.lg}
`;

const LanguageContainer = styled(ButtonContainerCommon)<{
  isSelected: boolean;
}>`
  background-color: ${({ isSelected, theme }) => (isSelected ? theme.colors.white : theme.colors.grey60)};
  width: 48px;
  ${({ isSelected }) =>
    isSelected
      ? `
  z-index: 3;
  `
      : ""}
`;

const FlagBackground = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

interface Props {
  selectedLanguageI18nCode?: Languages | null;
  currentLanguageI18nCode?: Languages | null;
  onLongPressSwitchLanguage?: () => void;
}

export const LanguageSwitch = ({ onLongPressSwitchLanguage }: Props) => {
  const { t, i18n } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  const selectedLanguage = getSelectedLanguageFromI18nCode(selectedLanguageI18nCode);
  const isFrenchSelected = currentLanguageI18nCode === "fr";

  const dispatch = useDispatch();

  const changeLanguage = (isFrenchSelected: boolean, selectedLanguageI18nCode: Languages) => {
    if (isFrenchSelected) {
      i18n.changeLanguage(selectedLanguageI18nCode);
      return dispatch(setCurrentLanguageActionCreator(selectedLanguageI18nCode));
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
      onLongPress={onLongPressSwitchLanguage}
      accessibilityRole="button"
      accessibilityLabel={t("global.change_language_accessibility")}
      activeOpacity={0.8}
    >
      <LanguageContainer isSelected={isFrenchSelected}>
        <FlagBackground>
          <Flag langueFr={"Français"} />
        </FlagBackground>
      </LanguageContainer>
      <LanguageContainer isSelected={!isFrenchSelected}>
        <FlagBackground>
          <Flag langueFr={selectedLanguage.langueFr} />
        </FlagBackground>
      </LanguageContainer>
    </ButtonContainer>
  );
};
