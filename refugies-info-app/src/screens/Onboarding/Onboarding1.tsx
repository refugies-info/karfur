import { View, Button } from "react-native";
import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";
import { TextNormal } from "../../components/StyledText";

export const Onboarding1 = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "Onboarding1">) => {
  return (
    <View>
      <Header />
      <TextNormal>
        {t("Onboarding1.welcome", "onboarding1 trad not loaded")}
      </TextNormal>
      <Button
        title="Suivant"
        onPress={() => {
          navigation.navigate("Onboarding2");
        }}
      />
    </View>
  );
};
