import React from "react";
import Step0 from "../../theme/images/onboarding/onboardingStep0.svg";
import Step1 from "../../theme/images/onboarding/onboardingStep1.svg";
import Step2 from "../../theme/images/onboarding/onboardingStep2.svg";
import Step3 from "../../theme/images/onboarding/onboardingStep3.svg";

interface Props {
  step: number;
}
export const CarouselStepImage = ({ step }: Props) => {
  switch (step) {
    case 0:
      return <Step0 />;
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;

    default:
      return <Step3 />;
  }
};
