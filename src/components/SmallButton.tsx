import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { theme } from "../theme";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border-radius: ${(props: { rounded: boolean }) =>
    !props.rounded ? theme.radius * 2 : theme.radius * 10}px;
  padding: ${theme.radius * 2}px;
  ${theme.shadows.lg}
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
}
export const SmallButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    rounded={!!props.rounded}
    style={props.style || {}}
    accessibilityRole="button"
    accessible={true}
    accessibilityLabel={props.label || ""}
  >
    <Icon
      name={props.iconName}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={theme.colors.black}
    />
  </ButtonContainer>
);
