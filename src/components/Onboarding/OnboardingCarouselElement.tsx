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
  color: ${({ theme }) => theme.colors.white};
  width: 100%;
`;

const TextContainer = styled.ScrollView`
  max-width: 100%;
  flex-grow: 0;
  margin-bottom: ${({ theme }) => theme.margin * 4}px;
`;

const ImagesContainer = styled.View`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  margin-top: ${styles.margin * 5}px;
`;
const stylesheet = StyleSheet.create({
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: styles.margin * 3,
    paddingTop: styles.margin * 6,
    paddingBottom: 160,
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
      style={[stylesheet.card]}
    >
      <ImagesContainer>
        <CarouselStepImage step={props.step} />
      </ImagesContainer>
      <TextContainer>
        <StyledText accessibilityRole="text">
          {t(
            "onboarding_screens." + correspondingData.text,
            correspondingData.text
          )}
        </StyledText>
      </TextContainer>
    </LinearGradient>
  );
};
