import { View } from "react-native";
import * as React from "react";
// import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
// import { useDispatch } from "react-redux";
import { OnboardingCarousel } from "../../components/Onboarding/OnboardingCarousel";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";

export const OnboardingSteps = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "OnboardingSteps">) => {
  // const dispatch = useDispatch();
  const finishOnboarding = () => {
    try {
      navigation.navigate("FilterCity");
      // dispatch(saveHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };

  const navigateBack = () => navigation.goBack();

  return (
    <View>
      <OnboardingCarousel
        finishOnboarding={finishOnboarding}
        navigateBack={navigateBack}
      />
    </View>
  );
};
