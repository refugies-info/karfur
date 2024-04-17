import * as React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { onboardingCarouselData } from "./OnboardingCarouselData";
import { TextBigBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  step: number;
}

const ImageBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
const ImageForeground = styled.View`
  z-index: 2;
  height: 55%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;
const TextContainer = styled.View`
  padding: ${({ theme }) => theme.margin * 3}px;
  height: 45%;
  justify-content: center;
`;
const StyledText = styled(TextBigBold)`
  width: 100%;
  text-align: center;
`;

export const OnboardingCarouselElement = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const onboardingElement = onboardingCarouselData[props.step];

  return (
    <View>
      <ImageBackground>{onboardingElement.background}</ImageBackground>
      <ImageForeground>{onboardingElement.image}</ImageForeground>
      <TextContainer>
        <StyledText accessibilityRole="text">
          {t("onboarding_screens." + onboardingElement.text)}
        </StyledText>
      </TextContainer>
    </View>
  );
};
