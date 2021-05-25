import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OnboardingParamList } from "../../types";
import { LanguageChoiceScreen } from "../screens/LanguageChoiceScreen";

const OnBoardingNavigator = createStackNavigator<OnboardingParamList>();

export const OnboardingStackNavigator = () => {
  return (
    <OnBoardingNavigator.Navigator>
      <OnBoardingNavigator.Screen
        name="LanguageChoice"
        component={LanguageChoiceScreen}
        options={{ headerTitle: "Language choice" }}
      />
    </OnBoardingNavigator.Navigator>
  );
};
