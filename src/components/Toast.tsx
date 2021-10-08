import React from "react";
import { Icon } from "react-native-eva-icons";
import { Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { theme } from "../theme";
import { RTLView } from "./BasicComponents";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

interface Props {
  text: string;
  textLink?: string;
  navigation?: any;
  onClose: () => void;
}
const ToastContainer = styled(Animated.View)`
  width: 90%;
  position: absolute;
  left: 5%;
  bottom: 100px;
  zIndex: 13;
`;
const ToastView = styled(RTLView)`
  background-color: ${theme.colors.lightBlue};
  border-radius: ${theme.radius * 2}px;
  justify-content: space-between;
  padding: ${theme.margin * 2}px;
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
const StyledText = styled.Text`
  color: ${theme.colors.darkBlue};
  font-weight: bold;
  ${(props: { isLink: boolean }) => props.isLink ? `
  text-decoration: underline;
  text-decoration-color: ${theme.colors.darkBlue};
  `: ""}
`;


export const Toast = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  // entrance animation
  let animation = React.useRef(new Animated.Value(0));
  React.useEffect(() => {
    Animated.timing(animation.current, {
      toValue: 100,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp)
    }).start();
  }, []);

  const bottom = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 0],
    extrapolate: "clamp",
  });

  return (
    <ToastContainer style={{ transform: [{ translateY: bottom }]}} >
      <ToastView>
        <RTLView>
          <TextIcon
            name="star"
            height={16}
            width={16}
            fill={theme.colors.darkBlue}
            isRTL={isRTL}
          />
          {props.textLink ?
            <TouchableOpacity onPress={() => props.navigation.navigate(props.textLink)}>
              <StyledText isLink={!!props.textLink}>
                {props.text}
              </StyledText>
            </TouchableOpacity> :
            <StyledText isLink={!!props.textLink}>
              {props.text}
            </StyledText>
          }
        </RTLView>

        <TouchableOpacity onPress={props.onClose}>
          <Icon
            name="close"
            height={24}
            width={24}
            fill={theme.colors.black}
          />
        </TouchableOpacity>
      </ToastView>
    </ToastContainer>
  );
};
