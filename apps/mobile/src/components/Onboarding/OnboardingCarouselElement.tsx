import { View } from "react-native";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";
import { TextDSFR_XL } from "../StyledText";
import { onboardingCarouselData } from "./OnboardingCarouselData";

interface Props {
  step: number;
  focused: boolean;
}
const Image = styled.View`
  z-index: 2;
  height: 55%;
  position: relative;
  justify-content: flex-end;
`;
const ImageBackground = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
const ImageForeground = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;
const TextContainer = styled.View`
  padding: ${({ theme }) => theme.margin * 3}px;
  height: 45%;
  justify-content: center;
  z-index: 3;
`;
const StyledText = styled(TextDSFR_XL)`
  width: 100%;
  text-align: center;
`;

export const OnboardingCarouselElement = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const onboardingElement = onboardingCarouselData[props.step];

  return (
    <View>
      <Image>
        <ImageBackground>{onboardingElement.background}</ImageBackground>
        <ImageForeground>{onboardingElement.image}</ImageForeground>
      </Image>
      <TextContainer>
        <StyledText accessibilityRole="text">
          <ReadableText isFocused={props.focused}>{t("onboarding_screens." + onboardingElement.text)}</ReadableText>
        </StyledText>
      </TextContainer>
    </View>
  );
};
