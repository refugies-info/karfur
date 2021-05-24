import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import i18n, { t } from "../services/i18n";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabParamList } from "../../types";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import { selectedI18nCodeSelector } from "../services/redux/User/user.selectors";

export const TabOneScreen = ({
  navigation,
}: StackScreenProps<BottomTabParamList, "TabOne">) => {
  const dispatch = useDispatch();

  const langue = useSelector(selectedI18nCodeSelector);

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, [langue]);

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    dispatch(saveSelectedLanguageActionCreator(ln));
  };

  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
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
      <Button
        onPress={() => cleanStorage("SELECTED_LANGUAGE")}
        title="clean storage langue"
      />
      <Button
        onPress={() => cleanStorage("HAS_USER_SEEN_ONBOARDING")}
        title="clean storage user"
      />

      <Button
        onPress={() => {
          navigation.navigate("NotFound");
        }}
        title="nav"
      />
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
