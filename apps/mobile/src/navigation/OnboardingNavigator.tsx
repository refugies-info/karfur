import { createStackNavigator } from "@react-navigation/stack";
import { ActivateNotificationsScreen } from "~/screens/Onboarding/ActivateNotificationsScreen";
import { FilterAge } from "~/screens/Onboarding/FilterAge";
import { FilterCity } from "~/screens/Onboarding/FilterCity";
import { FilterFrenchLevel } from "~/screens/Onboarding/FilterFrenchLevel";
import { FinishOnboarding } from "~/screens/Onboarding/FinishOnboarding";
import { LanguageChoiceScreen } from "~/screens/Onboarding/LanguageChoiceScreen";
import { OnboardingSteps } from "~/screens/Onboarding/OnboardingSteps";
import { OnboardingParamList } from "~/types/navigation";

const OnBoardingNavigator = createStackNavigator<OnboardingParamList>();

export const OnboardingStackNavigator = () => (
  <OnBoardingNavigator.Navigator screenOptions={{ headerShown: false }}>
    <OnBoardingNavigator.Screen name="LanguageChoice" component={LanguageChoiceScreen} />
    <OnBoardingNavigator.Screen name="OnboardingSteps" component={OnboardingSteps} />
    <OnBoardingNavigator.Screen name="FilterCity" component={FilterCity} />
    <OnBoardingNavigator.Screen name="FilterAge" component={FilterAge} />
    <OnBoardingNavigator.Screen name="FilterFrenchLevel" component={FilterFrenchLevel} />
    <OnBoardingNavigator.Screen name="ActivateNotificationsScreen" component={ActivateNotificationsScreen} />
    <OnBoardingNavigator.Screen name="FinishOnboarding" component={FinishOnboarding} />
  </OnBoardingNavigator.Navigator>
);
