import { View, Button } from "react-native";
import * as React from "react";
import { Text } from "../../components/Themed";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { t } from "../../services/i18n";

export const Onboarding1 = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "Onboarding1">) => {
  return (
    <View>
      <Text>{t("Onboarding1.welcome", "onboarding1 trad not loaded")}</Text>
      <Button
        title="Suivant"
        onPress={() => {
          navigation.navigate("Onboarding2");
        }}
      />
    </View>
  );
};
