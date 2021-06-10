import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.radius * 2}px;
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
}
export const SmallButton = (props: Props) => (
  <ButtonContainer onPress={props.onPress}>
    <Icon
      name={props.iconName}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={theme.colors.black}
    />
  </ButtonContainer>
);
