import React from "react";
import { Icon } from "react-native-eva-icons";
import { Animated, Easing, PixelRatio } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { styles } from "../theme";
import { RTLView } from "./BasicComponents";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { StyledTextVerySmallBold } from "./StyledText";

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
  background-color: ${styles.colors.black};
  border-radius: ${styles.radius * 2}px;
  justify-content: space-between;
  padding: ${styles.margin * 2}px;
  margin-horizontal: ${styles.margin * 3}px;
  ${styles.shadows.lg}
`;
const TextIcon = styled(Icon)`
  marginright: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin * 2}px;
  marginleft: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 2 : 0}px;
`;
const StyledText = styled(StyledTextVerySmallBold)`
  color: ${styles.colors.white};
`;

export const Toast = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  // Animations
  let animation = React.useRef(new Animated.Value(0));

  /**
   * Hide toast
   */
  const hideToast = React.useCallback(() => {
    Animated.timing(animation.current, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start(props.onClose);
  }, [props.onClose]);

  /**
   * Show toast on mount
   */
  React.useEffect(() => {
    Animated.timing(animation.current, {
      toValue: 100,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    const timer = setTimeout(() => {
      hideToast();
    }, 12000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const bottom = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 0],
    extrapolate: "clamp",
  });

  return (
    <ToastContainer style={{ transform: [{ translateY: bottom }] }}>
      <ToastView>
        <RTLView>
          <TextIcon
            name={props.icon}
            height={16}
            width={16}
            fill={styles.colors.white}
            isRTL={isRTL}
          />
          {props.i18nKey ? (
            <StyledText>{t(props.i18nKey, props.defaultText || "")}</StyledText>
          ) : (
            props.children
          )}
        </RTLView>

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
