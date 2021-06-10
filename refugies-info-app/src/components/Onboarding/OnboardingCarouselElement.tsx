import * as React from "react";

import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";
import { onboardingCarouselData } from "./OnboardingCarouselData";
import { StyledTextBigBold } from "../StyledText";
import { CarouselStepImage } from "./CarouselStepImage";
import EtatLogo from "../../theme/images/onboarding/onboardingStep2-logo.png";
import { Image } from "react-native";

interface Props {
  step: number;
}

const StyledText = styled(StyledTextBigBold)`
  color: ${theme.colors.white};
  margin-bottom: ${theme.margin * 5}px;
  margin-top: ${theme.margin * 3}px;
`;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.margin * 3,
  },
});
export const OnboardingCarouselElement = (props: Props) => {
  const correspondingData = onboardingCarouselData.filter(
    (element) => element.stepNumber === props.step
  )[0];
  return (
    <LinearGradient
      colors={[correspondingData.lightColor, correspondingData.darkColor]}
      // @ts-ignore
      style={[styles.card]}
    >
      <CarouselStepImage step={props.step} />
      {props.step === 2 && (
        <Image source={EtatLogo} style={{ marginTop: theme.margin * 3 }} />
      )}
      <StyledText>{correspondingData.text}</StyledText>
    </LinearGradient>
  );
};
