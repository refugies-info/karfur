import React from "react";
import Step0 from "../../theme/images/onboarding/onboardingStep0_v1_opt.png";
import { Image, StyleSheet } from "react-native";
import Step1 from "../../theme/images/onboarding/onboardingStep1_opt.png";
import Step2 from "../../theme/images/onboarding/onboardingStep2_opt.svg";
import Step3 from "../../theme/images/onboarding/onboardingStep3_opt.svg";

interface Props {
  step: number;
}

const styles = StyleSheet.create({
  step1: {
    resizeMode: "contain", // or 'stretch'
    height: 230,
  },
  step0: {
    width: 200,
    resizeMode: "contain", // or 'stretch'
  },
});
export const CarouselStepImage = ({ step }: Props) => {
  switch (step) {
    case 0:
      return <Image source={Step0} style={styles.step0} />;
    case 1:
      return <Image source={Step1} style={styles.step1} />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;

    default:
      return <Step3 />;
  }
};
