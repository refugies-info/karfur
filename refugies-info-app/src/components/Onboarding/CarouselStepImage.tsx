import React from "react";
import Step0 from "../../theme/images/onboarding/onboardingStep0_opt.svg";
import Step1 from "../../theme/images/onboarding/onboardingStep1_opt.svg";
import Step2 from "../../theme/images/onboarding/onboardingStep2_opt.svg";
import Step3 from "../../theme/images/onboarding/onboardingStep3_opt.svg";

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
