import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import i18n, { t } from "../services/i18n";
import { Button } from "react-native";
import { I18nManager as RNI18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabOneScreen() {
  const [changeLang, setChangeLang] = React.useState(false);
  // @ts-ignore
  const changeLanguage = (ln: string) => {
    console.log("change language", ln);
    i18n.changeLanguage(ln);
    try {
      AsyncStorage.setItem("SELECTED_LANGUAGE", ln);
    } catch (e) {
      // saving error
    }
    setChangeLang(!changeLang);
  };
  const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";
  console.log("i18n.locale", i18n.locale, i18n.dir, i18n.isRTL);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One mono</Text>
      <Text style={styles.title2}>Tab One circular</Text>

      <Text style={styles.title2}>{t("lists", "options")}</Text>
      <Text style={styles.title2}>{t("homepage.test", "options")}</Text>
      <Button onPress={() => changeLanguage("ar")} title="button ar" />
      <Button onPress={() => changeLanguage("en")} title="button en" />
      <Button onPress={() => changeLanguage("fr")} title="button fr" />

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "circular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
