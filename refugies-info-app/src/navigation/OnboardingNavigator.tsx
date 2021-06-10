import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OnboardingParamList } from "../../types";
import { OnboardingStart } from "../screens/Onboarding/OnboardingStart";
import { OnboardingSteps } from "../screens/Onboarding/OnboardingSteps";
import { FilterCity } from "../screens/Onboarding/FilterCity";

const OnBoardingNavigator = createStackNavigator<OnboardingParamList>();

export const OnboardingStackNavigator = () => (
  <OnBoardingNavigator.Navigator screenOptions={{ headerShown: false }}>
    <OnBoardingNavigator.Screen
      name="OnboardingStart"
      component={OnboardingStart}
    />
    <OnBoardingNavigator.Screen
      name="OnboardingSteps"
      component={OnboardingSteps}
    />
    <OnBoardingNavigator.Screen name="FilterCity" component={FilterCity} />
  </OnBoardingNavigator.Navigator>
);
