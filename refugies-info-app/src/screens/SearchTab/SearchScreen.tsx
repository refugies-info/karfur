import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { View } from "react-native";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";

export const SearchScreen = () => (
  <View>
    <Header />
    <TextNormal>Search screen</TextNormal>

    <TextNormal>{t("lists", "options")}</TextNormal>
    <TextNormal>{t("homepage.test", "options")}</TextNormal>
  </View>
);
