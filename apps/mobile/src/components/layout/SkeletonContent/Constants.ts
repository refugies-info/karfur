import { StyleProp, ViewStyle } from "react-native";
import Animated, { Easing } from "react-native-reanimated";

export interface ICustomViewStyle extends ViewStyle {
  children?: ICustomViewStyle[];
  key?: number | string;
}

export interface ISkeletonContentProps {
  isLoading: boolean;
  layout?: ICustomViewStyle[];
  duration?: number;
  containerStyle?: StyleProp<ViewStyle>;
  boneColor?: string;
  highlightColor?: string;
  easing?: Animated.EasingFunction;
  children?: any;
}

export interface IDirection {
  x: number;
  y: number;
}

export const DEFAULT_BORDER_RADIUS = 4;
export const DEFAULT_DURATION = 1200;
export const DEFAULT_BONE_COLOR = "#E1E9EE";
export const DEFAULT_HIGHLIGHT_COLOR = "#F2F8FC";
export const DEFAULT_EASING: Animated.EasingFunction = Easing.bezier(0.5, 0, 0.25, 1).factory();
export const DEFAULT_LOADING = true;
