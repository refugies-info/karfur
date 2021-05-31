import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { View } from "react-native";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";
import { useSelector } from "react-redux";
import {
  currentI18nCodeSelector,
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";

export const FavorisScreen = () => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  return (
    <View>
      <Header
        currentLanguageI18nCode={currentLanguageI18nCode}
        selectedLanguageI18nCode={selectedLanguageI18nCode}
      />
      <TextNormal>Favoris screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
    </View>
  );
};
