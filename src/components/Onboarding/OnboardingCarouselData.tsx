import * as React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import Step0 from "../../theme/images/onboarding/step0.png";
import Step1 from "../../theme/images/onboarding/step1.png";
import Step2 from "../../theme/images/onboarding/step2.png";
import Step3 from "../../theme/images/onboarding/step3.png";
import Step4 from "../../theme/images/onboarding/step4.png";
import { BackStep1 } from "../../theme/images/onboarding/BackStep1";
import { BackStep2 } from "../../theme/images/onboarding/BackStep2";
import { BackStep3 } from "../../theme/images/onboarding/BackStep3";
import { BackStep4 } from "../../theme/images/onboarding/BackStep4";

const imageStyle: StyleProp<ImageStyle> = {
  resizeMode: "contain",
  width: 375,
  height: 339,
};

export const onboardingCarouselData = [
  {
    image: null,
    background: (
      <Image
        source={Step0}
        style={{
          resizeMode: "cover",
          width: "100%",
          height: 450,
        }}
      />
    ),
    text: "step0",
  },
  {
    image: <Image source={Step1} style={imageStyle} />,
    background: <BackStep1 />,
    text: "step1",
  },
  {
    image: <Image source={Step2} style={imageStyle} />,
    background: <BackStep2 />,

    text: "step2",
  },
  {
    image: <Image source={Step3} style={imageStyle} />,
    background: <BackStep3 />,

    text: "step3",
  },
  {
    image: <Image source={Step4} style={imageStyle} />,
    background: <BackStep4 />,

    text: "step4",
  },
];
