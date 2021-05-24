import { View, Button } from "react-native";
import * as React from "react";
import { Text } from "../../components/Themed";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";

export const Onboarding1 = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "Onboarding1">) => {
  return (
    <View>
      <Text>Onboarding1</Text>
      <Button
        title="Suivant"
        onPress={() => {
          navigation.navigate("Onboarding2");
        }}
      />
    </View>
  );
};
