import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { Button, AsyncStorage } from "react-native";
import { t } from "../../services/i18n";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { useSelector } from "react-redux";
import {
  currentI18nCodeSelector,
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";

export const ProfilScreen = () => {
  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
    } catch (e) {}
  };

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  return (
    <WrapperWithHeaderAndLanguageModal
      currentLanguageI18nCode={currentLanguageI18nCode}
      selectedLanguageI18nCode={selectedLanguageI18nCode}
    >
      <TextNormal>Profil screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
      <Button
        onPress={() => cleanStorage("SELECTED_LANGUAGE")}
        title="Reset langue"
      />
      <Button
        onPress={() => cleanStorage("HAS_USER_SEEN_ONBOARDING")}
        title="Reset has seen onboarding"
      />
    </WrapperWithHeaderAndLanguageModal>
  );
};
