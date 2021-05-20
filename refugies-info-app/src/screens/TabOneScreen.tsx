import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import i18n, { t } from "../services/i18n";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEnvironment } from "../libs/getEnvironment";
import { useDispatch } from "react-redux";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";

export const TabOneScreen = () => {
  const [changeLang, setChangeLang] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, []);

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    try {
      AsyncStorage.setItem("SELECTED_LANGUAGE", ln);
    } catch (e) {}
    setChangeLang(!changeLang);
  };
  const dbURL = getEnvironment().dbUrl;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One mono</Text>
      <Text style={styles.title2}>Tab One circular</Text>

      <Text style={styles.title2}>{t("lists", "options")}</Text>
      <Text style={styles.title2}>{t("homepage.test", "options")}</Text>
      <Text style={styles.title2}>{dbURL}</Text>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
