import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import i18n, { t } from "../services/i18n";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLanguagesActionCreator,
  saveSelectedLanguageActionCreator,
} from "../services/redux/Languages/languages.actions";
import { selectedI18nCodeSelector } from "../services/redux/Languages/languages.selectors";

export const TabOneScreen = () => {
  const dispatch = useDispatch();

  const langue = useSelector(selectedI18nCodeSelector);

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, [langue]);

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    dispatch(saveSelectedLanguageActionCreator(ln));
  };

  const cleanStorage = () => {
    try {
      AsyncStorage.removeItem("SELECTED_LANGUAGE");
    } catch (e) {}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One mono</Text>
      <Text style={styles.title2}>Tab One circular</Text>

      <Text style={styles.title2}>{t("lists", "options")}</Text>
      <Text style={styles.title2}>{t("homepage.test", "options")}</Text>

      <Button onPress={() => changeLanguage("ar")} title="button ar" />
      <Button onPress={() => changeLanguage("en")} title="button en" />
      <Button onPress={() => changeLanguage("fr")} title="button fr" />
      <Button onPress={cleanStorage} title="clean storage" />

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
