import React from "react";
import { Icon } from "react-native-eva-icons";
import { Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { theme } from "../theme";
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
  bottom: 100px;
  z-index: 13;
`;
const ToastView = styled(RTLView)`
  background-color: ${theme.colors.black};
  border-radius: ${theme.radius * 2}px;
  justify-content: space-between;
  padding: ${theme.margin * 2}px;
  margin-horizontal: ${theme.margin * 3}px;
  shadow-color: #212121;
  shadow-offset: 0 8px;
  shadow-opacity: 0.24;
  shadow-radius: 16px;
  elevation: 13;
`;
const TextIcon = styled(Icon)`
  marginRight: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  marginLeft: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;
const StyledText = styled(StyledTextVerySmallBold)`
  color: ${theme.colors.white};
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
      easing: Easing.out(Easing.exp)
    }).start(props.onClose);
  }, [props.onClose])

  /**
   * Show toast on mount
   */
  React.useEffect(() => {
    Animated.timing(animation.current, {
      toValue: 100,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp)
    }).start();

    const timer = setTimeout(() => {
      hideToast()
    }, 12000);

    return () => { clearTimeout(timer) }
  }, []);

  const bottom = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 0],
    extrapolate: "clamp",
  });

  return (
    <ToastContainer style={{ transform: [{ translateY: bottom }]}} >
      <ToastView>
        <RTLView>
          <TextIcon
            name={props.icon}
            height={16}
            width={16}
            fill={theme.colors.white}
            isRTL={isRTL}
          />
          {props.i18nKey ?
            <StyledText>{t(props.i18nKey, props.defaultText || "")}</StyledText> :
            props.children
          }
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
            fill={theme.colors.white}
          />
        </TouchableOpacity>
      </ToastView>
    </ToastContainer>
  );
};
