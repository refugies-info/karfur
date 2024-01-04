import * as React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

const MainContainer = styled.View`
  flex-direction: row;
  margin-horizontal: -${({ theme }) => theme.margin * 0.75}px;
`;
const ProgressBarContainer = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey60};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  margin-horizontal: ${({ theme }) => theme.margin * 0.75}px;
  flex: 1;
  overflow: hidden;
`;
const ProgressBar = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkBlue};
`;

interface Props {
  step: number;
}
export const OnboardingProgressBar = (props: Props) => {
  const width = useSharedValue(0);
  const animatedWidth = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  React.useEffect(() => {
    setTimeout(() => {
      width.value = withTiming(100, { duration: 800 });
    }, 300);
  }, []);

  const getWidth = (step: number) => {
    if (props.step === step) {
      return animatedWidth;
    } else if (props.step >= step) {
      return { width: "100%" };
    }
    return { width: 0 };
  };

  return (
    <MainContainer>
      <ProgressBarContainer>
        <ProgressBar style={[getWidth(1)]} />
      </ProgressBarContainer>
      <ProgressBarContainer>
        <ProgressBar style={[getWidth(2)]} />
      </ProgressBarContainer>
      <ProgressBarContainer>
        <ProgressBar style={[getWidth(3)]} />
      </ProgressBarContainer>
    </MainContainer>
  );
};
