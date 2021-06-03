import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { Button, AsyncStorage } from "react-native";
import { t } from "../../services/i18n";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";

export const ProfilScreen = () => {
  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
    } catch (e) {}
  };

  return (
    <WrapperWithHeaderAndLanguageModal>
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
