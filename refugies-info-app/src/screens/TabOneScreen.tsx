import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { t } from "../services/i18n";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabParamList } from "../../types";

export const TabOneScreen = ({
  navigation,
}: StackScreenProps<BottomTabParamList, "TabOne">) => {
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
