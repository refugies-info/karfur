import React from "react";
import { Icon } from "react-native-eva-icons";
import { PixelRatio, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled, { useTheme } from "styled-components/native";
import { styles } from "../theme";
import { RTLView } from "./BasicComponents";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { StyledTextVerySmallBold } from "./StyledText";
import { Columns, Rows } from "./layout";

interface Props {
  i18nKey?: string;
  defaultText?: string;
  icon: string;
  onClose: () => void;
  children?: any;
}

const ToastContainer = styled(Animated.View)`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: ${140 * Math.max(1, PixelRatio.getFontScale() / 2)}px;
  z-index: 13;
`;

const ToastView = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  justify-content: space-between;
  padding: ${({ theme }) => theme.margin * 2}px;
  margin-horizontal: ${({ theme }) => theme.margin * 3}px;
  ${({ theme }) => theme.shadows.lg}
`;
const TextIcon = styled(Icon)`
  marginright: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin * 2)}px;
  marginleft: ${({ theme }) => (theme.i18n.isRTL ? theme.margin * 2 : 0)}px;
`;
const StyledText = styled(StyledTextVerySmallBold)`
  color: ${({ theme }) => theme.colors.white};
`;

const HIDING_TIMEOUT = 12000;
const ANIMATION_DURATION = 400;
const ANIMATION_OPTIONS = {
  duration: ANIMATION_DURATION,
  easing: Easing.ease,
};

export const Toast = (props: Props) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();

  // Animations
  const bottom = useSharedValue(0);
  const animatedBottom = useAnimatedStyle(() => ({
    transform: [
      //@ts-ignore
      {
        translateY: interpolate(
          bottom.value,
          [0, 100],
          [180, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  /**
   * Hide toast
   */
  const hideToast = React.useCallback(() => {
    if (bottom.value !== 0) {
      bottom.value = withTiming(0, ANIMATION_OPTIONS);
      props.onClose();
    }
  }, [props.onClose]);

  /**
   * Show toast on mount
   */
  React.useEffect(() => {
    bottom.value = withTiming(100, ANIMATION_OPTIONS);

    const timer = setTimeout(() => {
      hideToast();
    }, HIDING_TIMEOUT);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ToastContainer style={[animatedBottom]}>
      <ToastView>
        <Columns RTLBehaviour layout="auto" verticalAlign="center">
          <TextIcon
            name={props.icon}
            height={16}
            width={16}
            fill={theme.colors.white}
          />
          {props.i18nKey ? (
            <StyledText>{t(props.i18nKey, props.defaultText || "")}</StyledText>
          ) : (
            props.children
          )}
        </Columns>

        <TouchableOpacity
          onPress={hideToast}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={t("global.close")}
        >
          <Icon
            name="close"
            height={24}
            width={24}
            fill={styles.colors.white}
          />
        </TouchableOpacity>
      </ToastView>
    </ToastContainer>
  );
};
