import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  padding: ${theme.radius * 2}px;
`;

const ICON_SIZE = 24;
export const SmallButton = () => (
  <ButtonContainer>
    <Icon
      name="volume-up-outline"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={theme.colors.black}
    />
  </ButtonContainer>
);
