import * as React from "react";
import { ViewStyle } from "react-native";
import Animated, {
  AnimateStyle,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks";
import { ButtonDSFR } from "../buttons";

const MainContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;
const ProgressContainer = styled.View`
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
`;
const ProgressBarContainer = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.dsfr_backgroundDisabled};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  margin-horizontal: ${({ theme }) => theme.margin}px;
  flex: 1;
  overflow: hidden;
`;
const ProgressBar = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.dsfr_blueActive};
`;

interface Props {
  step: number;
  onSkip: () => void;
}
export const OnboardingProgressBar = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const width = useSharedValue(0);
  const animatedWidth = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  React.useEffect(() => {
    setTimeout(() => {
      width.value = withTiming(100, { duration: 800 });
    }, 300);
  }, []);

  const getWidth = (step: number): AnimateStyle<ViewStyle> => {
    if (props.step === step) {
      return animatedWidth;
    } else if (props.step >= step) {
      return { width: "100%" };
    }
    return { width: 0 };
  };

  return (
    <MainContainer>
      <ProgressContainer>
        <ProgressBarContainer>
          <ProgressBar style={[getWidth(1)]} />
        </ProgressBarContainer>
        <ProgressBarContainer>
          <ProgressBar style={[getWidth(2)]} />
        </ProgressBarContainer>
        <ProgressBarContainer>
          <ProgressBar style={[getWidth(3)]} />
        </ProgressBarContainer>
      </ProgressContainer>
      <ButtonDSFR
        onPress={props.onSkip}
        priority="tertiary no outline"
        size="small"
        title={t("onboarding_screens.skip")}
        accessibilityLabel={t("onboarding_screens.skip")}
      />
    </MainContainer>
  );
};
