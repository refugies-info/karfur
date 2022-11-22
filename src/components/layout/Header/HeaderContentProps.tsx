import { Animated } from "react-native";

export type HeaderContentProps = {
  animatedController: Animated.Value;
  showSimplifiedHeader: boolean;
  title?: string;
};
