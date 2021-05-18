import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import i18n, { t } from "../services/i18n";
import { Button } from "react-native";
import { I18nManager as RNI18nManager } from "react-native";

export default function TabOneScreen() {
  const [changeLang, setChangeLang] = React.useState(false);
  // @ts-ignore
  const changeLanguage = () => {
    console.log("change language");
    setChangeLang(true);
    i18n.changeLanguage("ar");
  };
  const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";
  console.log("RNDir tab one", RNDir);
  console.log("i18n.locale", i18n.locale, i18n.dir, i18n.isRTL);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One mono</Text>
      <Text style={styles.title2}>Tab One circular</Text>

      <Text style={styles.title2}>{t("lists", "options")}</Text>
      <Text style={styles.title2}>{t("homepage.test", "options")}</Text>
      <View onPress={changeLanguage}>
        <Text>{"Change language"}</Text>
      </View>
      <Button onPress={changeLanguage} title="button" />

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
