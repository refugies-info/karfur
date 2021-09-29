import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${(props: { reversed: boolean }) =>
    props.reversed ? theme.colors.black : theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.radius * 2}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 1;
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
  reversed?: boolean;
}
export const SmallButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    reversed={props.reversed}
  >
    <Icon
      name={props.iconName}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={props.reversed ? theme.colors.white : theme.colors.black}
    />
  </ButtonContainer>
);
