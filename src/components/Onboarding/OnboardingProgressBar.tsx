import * as React from "react";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { theme } from "../../theme";

const MainContainer = styled.View`
  flex-direction: row;
  margin-horizontal: -${theme.margin * 0.75}px;
`;
const ProgressBarContainer = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${(props: { isDone: boolean }) =>
  props.isDone ? theme.colors.darkBlue : theme.colors.grey60};
  border-radius: ${theme.radius * 2}px;
  margin-horizontal: ${theme.margin * 0.75}px;
  flex: 1;
  overflow: hidden;
`;
const ProgressBar = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: ${theme.colors.darkBlue};
`;

interface Props {
  step: number;
}
export const OnboardingProgressBar = (props: Props) => {
  let animation = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(animation.current, {
        toValue: 100,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }, 300);
  }, []);

  const getWidth = (step: number) => {
    if (props.step === step) {
      return animation.current.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
      });
    } else if (props.step >= step) {
      return "100%";
    }
    return 0;
  }

  return (
    <MainContainer>
      <ProgressBarContainer>
        <ProgressBar isDone={props.step >= 1} style={[{width: getWidth(1)}]} />
      </ProgressBarContainer>
      <ProgressBarContainer>
        <ProgressBar isDone={props.step >= 2} style={[{width: getWidth(2)}]} />
      </ProgressBarContainer>
      <ProgressBarContainer>
        <ProgressBar isDone={props.step >= 3} style={[{width: getWidth(3)}]} />
      </ProgressBarContainer>
    </MainContainer>
  );
};
