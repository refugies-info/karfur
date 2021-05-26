import * as React from "react";
import { View } from "../components/Themed";
import { t } from "../services/i18n";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabParamList } from "../../types";
import { Header } from "../components/Header";
import { TextNormal } from "../components/StyledText";

export const TabOneScreen = ({
  navigation,
}: StackScreenProps<BottomTabParamList, "TabOne">) => {
  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
    } catch (e) {}
  };
  return (
    <View>
      <Header />
      <TextNormal>test rlt</TextNormal>

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
