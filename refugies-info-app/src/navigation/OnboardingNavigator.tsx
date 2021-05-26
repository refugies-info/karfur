import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OnboardingParamList } from "../../types";
import { Onboarding1 } from "../screens/Onboarding/Onboarding1";
import { Onboarding2 } from "../screens/Onboarding/Onboarding2";

const OnBoardingNavigator = createStackNavigator<OnboardingParamList>();

export const OnboardingStackNavigator = () => (
  <OnBoardingNavigator.Navigator screenOptions={{ headerShown: false }}>
    <OnBoardingNavigator.Screen
      name="Onboarding1"
      component={Onboarding1}
      options={{ headerTitle: "Onboarding1" }}
    />
    <OnBoardingNavigator.Screen
      name="Onboarding2"
      component={Onboarding2}
      options={{ headerTitle: "Onboarding2" }}
    />
  </OnBoardingNavigator.Navigator>
);
