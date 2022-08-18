import * as React from "react";

import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../theme";
import { onboardingCarouselData } from "./OnboardingCarouselData";
import { TextBigBold } from "../StyledText";
import { CarouselStepImage } from "./CarouselStepImage";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  step: number;
}

const StyledText = styled(TextBigBold)`
  color: ${styles.colors.white};
  margin-bottom: ${styles.margin * 25}px;
  margin-top: ${styles.margin * 3}px;
  width: 100%;
`;
const ImagesContainer = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: ${styles.margin * 5}px;
`;
const stylesheet = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: styles.margin * 3,
    paddingTop: styles.margin * 6,
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
      style={[stylesheet.card]}
    >
      <ImagesContainer>
        <CarouselStepImage step={props.step} />
      </ImagesContainer>
      <StyledText>
        {t("onboarding_screens." + correspondingData.text, correspondingData.text)}
      </StyledText>
    </LinearGradient>
  );
};
