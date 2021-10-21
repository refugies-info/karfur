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
  ${(props: { bigShadow: boolean }) => props.bigShadow ? `
  shadow-color: #212121;
  shadow-offset: 0 8px;
  shadow-opacity: 0.24;
  shadow-radius: 16px;
  elevation: 17;
  ` : `
  shadow-color: #212121;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 40px;
  elevation: 1;
  `}
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
  reversed?: boolean;
  rounded?: boolean;
  bigShadow?: boolean;
  style?: any;
}
export const SmallButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    reversed={props.reversed}
    rounded={!!props.rounded}
    bigShadow={!!props.bigShadow}
    style={props.style || {}}
  >
    <Icon
      name={props.iconName}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={props.reversed ? theme.colors.white : theme.colors.black}
    />
  </ButtonContainer>
);
