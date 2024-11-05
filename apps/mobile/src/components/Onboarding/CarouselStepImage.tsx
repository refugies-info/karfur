import { Image, StyleSheet } from "react-native";

import Step0 from "~/theme/images/onboarding/illu-step0.png";
import Step1 from "~/theme/images/onboarding/illu-step1.png";
import Step2 from "~/theme/images/onboarding/illu-step2.png";
import Step3 from "~/theme/images/onboarding/illu-step3.svg";

interface Props {
  step: number;
}

const stylesheet = StyleSheet.create({
  step0: {
    width: 250,
    height: 261,
    resizeMode: "contain", // or 'stretch'
  },
  step1: {
    width: 296,
    height: 204,
    resizeMode: "contain", // or 'stretch'
  },
  step2: {
    width: 286,
    height: 187,
    resizeMode: "contain", // or 'stretch'
  },
});
export const CarouselStepImage = ({ step }: Props) => {
  switch (step) {
    case 0:
      return <Image source={Step0} style={stylesheet.step0} />;
    case 1:
      return <Image source={Step1} style={stylesheet.step1} />;
    case 2:
      return (
        <Image
          source={Step2}
          style={stylesheet.step2}
          accessible={true}
          accessibilityLabel="Gouvernement Liberté Egalité Fraternité. Délégation interministérielle à l'accueil et à l'intégration des réfugiés."
        />
      );
    case 3:
      return <Step3 width={160} height={160} />;

    default:
      return <Step3 />;
  }
};
