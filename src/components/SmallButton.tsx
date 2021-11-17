import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${(props: { reversed: boolean }) =>
    props.reversed ? theme.colors.black : theme.colors.white};
  border-radius: ${(props: { rounded: boolean }) =>
    !props.rounded ? theme.radius * 2 : theme.radius * 10}px;
  padding: ${theme.radius * 2}px;
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 7;
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
  reversed?: boolean;
  rounded?: boolean;
  style?: any;
  label?: string;
}
export const SmallButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    reversed={props.reversed}
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
      fill={props.reversed ? theme.colors.white : theme.colors.black}
    />
  </ButtonContainer>
);
