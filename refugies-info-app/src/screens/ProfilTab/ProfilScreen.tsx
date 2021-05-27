import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { View, Button, AsyncStorage } from "react-native";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";

export const ProfilScreen = () => {
  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
    } catch (e) {}
  };

  return (
    <View>
      <Header />
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
    </View>
  );
};
