import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { Animated, StyleSheet } from "react-native";
import { useInterval } from "../../libs/useInterval";

const MainContainer = styled.View`
  height: 4px;
  width: 100%;
  background-color: ${theme.colors.grey60};
  border-radius: ${theme.radius * 2}px;
`;

interface Props {
  step: number;
}
export const OnboardingProgressBar = (props: Props) => {
  const [progress, setProgress] = React.useState(0);

  let animation = React.useRef(new Animated.Value(0));
  useInterval(() => {
    if (progress < 33 * props.step) {
      setProgress(progress + 5);
    }
  }, 30);

  React.useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  React.useEffect(() => {
    setProgress(33 * (props.step - 1));
  }, [props.step]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <MainContainer>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.darkBlue,
            width,
            borderRadius: theme.radius * 2,
          },
        ]}
      />
    </MainContainer>
  );
};
