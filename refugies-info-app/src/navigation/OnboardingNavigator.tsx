import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OnboardingParamList } from "../../types";
import { OnboardingStart } from "../screens/Onboarding/OnboardingStart";
import { OnboardingSteps } from "../screens/Onboarding/OnboardingSteps";
import { FilterCity } from "../screens/Onboarding/FilterCity";
import { FilterAge } from "../screens/Onboarding/FilterAge";
import { FilterFrenchLevel } from "../screens/Onboarding/FilterFrenchLevel";
import { FinishOnboarding } from "../screens/Onboarding/FinishOnboarding";

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
    <OnBoardingNavigator.Screen name="FilterAge" component={FilterAge} />
    <OnBoardingNavigator.Screen
      name="FilterFrenchLevel"
      component={FilterFrenchLevel}
    />
    <OnBoardingNavigator.Screen
      name="FinishOnboarding"
      component={FinishOnboarding}
    />
  </OnBoardingNavigator.Navigator>
);
