import * as React from "react";

import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";
import { onboardingCarouselData } from "./OnboardingCarouselData";
import { TextBigBold } from "../StyledText";
import { CarouselStepImage } from "./CarouselStepImage";
import EtatLogo from "../../theme/images/onboarding/onboardingStep2-logov1.png";
import { Image } from "react-native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  step: number;
}

const StyledText = styled(TextBigBold)`
  color: ${theme.colors.white};
  margin-bottom: ${theme.margin * 25}px;
  margin-top: ${theme.margin * 3}px;
`;
const ImagesContainer = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.margin * 3,
    paddingTop: theme.margin * 6,
  },
});
export const OnboardingCarouselElement = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const correspondingData = onboardingCarouselData.filter(
    (element) => element.stepNumber === props.step
  )[0];
  return (
    <LinearGradient
      colors={[correspondingData.lightColor, correspondingData.darkColor]}
      // @ts-ignore
      style={[styles.card]}
    >
      <ImagesContainer>
        <CarouselStepImage step={props.step} />
        {props.step === 2 && (
          <Image
            source={EtatLogo}
            style={{
              marginTop: theme.margin * 3,
              resizeMode: "contain",
              height: 90,
            }}
          />
        )}
      </ImagesContainer>
      <StyledText>
        {t("Onboarding." + correspondingData.text, correspondingData.text)}
      </StyledText>
    </LinearGradient>
  );
};
