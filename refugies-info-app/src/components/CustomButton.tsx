import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { theme } from "../theme";
import { StyledTextSmallBold } from "./StyledText";

const ButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  justify-content: center;
  padding: ${theme.radius * 3}px;
  border-radius: ${theme.radius * 2}px;
`;

const ColoredText = styled(StyledTextSmallBold)`
  color: ${(props: { textColor: string }) => props.textColor};
`;

interface Props {
  textColor: string;
  text: string;
  onPress: () => void;
}

export const CustomButton = (props: Props) => (
  <ButtonContainer onPress={props.onPress}>
    <ColoredText textColor={props.textColor}>{props.text}</ColoredText>
  </ButtonContainer>
);
