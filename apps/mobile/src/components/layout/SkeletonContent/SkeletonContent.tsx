/**
 * Simplified version of https://github.com/alexZajac/react-native-skeleton-content which is not
 * maintained anymore, to use react-native-reanimated 3.3.0
 */
import * as React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  withTiming,
  useSharedValue,
  withRepeat,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";

import {
  ICustomViewStyle,
  DEFAULT_BONE_COLOR,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_EASING,
  DEFAULT_DURATION,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LOADING,
  ISkeletonContentProps,
} from "./Constants";

const styles = StyleSheet.create({
  absoluteGradient: {
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  gradientChild: {
    flex: 1,
  },
});

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 0 };

const useLayout = () => {
  const [size, setSize] = React.useState<any>({ width: 0, height: 0 });

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

const SkeletonContent: React.FunctionComponent<ISkeletonContentProps> = ({
  containerStyle = styles.container,
  easing = DEFAULT_EASING,
  duration = DEFAULT_DURATION,
  layout = [],
  isLoading = DEFAULT_LOADING,
  boneColor = DEFAULT_BONE_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  children,
}) => {
  const animationValue = useSharedValue(0);
  const [componentSize, onLayout] = useLayout();

  React.useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, { duration: duration / 2, easing }),
      -1,
      true
    );
  }, []);

  const getBoneWidth = (boneLayout: ICustomViewStyle): number =>
    (typeof boneLayout.width === "string"
      ? componentSize.width
      : boneLayout.width) || 0;
  const getBoneHeight = (boneLayout: ICustomViewStyle): number =>
    (typeof boneLayout.height === "string"
      ? componentSize.height
      : boneLayout.height) || 0;

  const getBoneContainer = (
    layoutStyle: ICustomViewStyle,
    childrenBones: React.ReactNode[],
    key: number | string
  ) => (
    <View key={layoutStyle.key || key} style={layoutStyle}>
      {childrenBones}
    </View>
  );

  const getShiverBone = (
    layoutStyle: ICustomViewStyle,
    key: number | string
  ): React.ReactNode => {
    const boneWidth = getBoneWidth(layoutStyle);
    const boneHeight = getBoneHeight(layoutStyle);
    const { backgroundColor, borderRadius } = layoutStyle;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              animationValue.value,
              [0, 1],
              [-boneWidth, +boneWidth],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    const gradient = React.useMemo(
      () => (
        <LinearGradient
          colors={[boneColor!, highlightColor!, boneColor!]}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.gradientChild}
        />
      ),
      [highlightColor, boneColor]
    );

    return (
      <View
        key={layoutStyle.key || key}
        style={{
          ...layoutStyle,
          width: boneWidth,
          height: boneHeight,
          borderRadius: borderRadius || DEFAULT_BORDER_RADIUS,
          overflow: "hidden",
          backgroundColor: backgroundColor || boneColor,
        }}
      >
        <Animated.View style={[styles.absoluteGradient, animatedStyle]}>
          {gradient}
        </Animated.View>
      </View>
    );
  };

  const getBones = (
    bonesLayout: ICustomViewStyle[] | undefined,
    childrenItems: any,
    prefix: string | number = ""
  ): React.ReactNode[] => {
    if (bonesLayout && bonesLayout.length > 0) {
      const iterator: number[] = new Array(bonesLayout.length).fill(0);
      return iterator.map((_, i) => {
        // has a nested layout
        if (bonesLayout[i].children && bonesLayout[i].children!.length > 0) {
          const containerPrefix = bonesLayout[i].key || `bone_container_${i}`;
          const { children: childBones, ...layoutStyle } = bonesLayout[i];
          return getBoneContainer(
            layoutStyle,
            getBones(childBones, [], containerPrefix),
            containerPrefix
          );
        }
        return getShiverBone(bonesLayout[i], prefix ? `${prefix}_${i}` : i);
      });
      // no layout, matching children's layout
    }
    return React.Children.map(childrenItems, (child, i) => {
      const styling = child.props.style || {};
      return getShiverBone(styling, i);
    });
  };

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {isLoading ? getBones(layout!, children) : children}
    </View>
  );
};

export default React.memo(SkeletonContent);
