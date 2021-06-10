import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OnboardingParamList } from "../../types";
import { OnboardingStart } from "../screens/Onboarding/OnboardingStart";
import { OnboardingStep1 } from "../screens/Onboarding/OnboardingStep1";

const OnBoardingNavigator = createStackNavigator<OnboardingParamList>();

export const OnboardingStackNavigator = () => (
  <OnBoardingNavigator.Navigator screenOptions={{ headerShown: false }}>
    <OnBoardingNavigator.Screen
      name="OnboardingStart"
      component={OnboardingStart}
      options={{ headerTitle: "OnboardingStart" }}
    />
    <OnBoardingNavigator.Screen
      name="OnboardingStep1"
      component={OnboardingStep1}
      options={{ headerTitle: "OnboardingStep1" }}
    />
  </OnBoardingNavigator.Navigator>
);
