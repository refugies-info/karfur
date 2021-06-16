import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { theme } from "../../theme";
import { StyledTextNormalBold } from "../StyledText";

interface Props {
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

const MainContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.black : theme.colors.white};
  padding: ${theme.margin * 2}px;
  box-shadow: 0px 8px 16px rgba(33, 33, 33, 0.24);
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${theme.margin * 2}px;
`;

const StyledText = styled(StyledTextNormalBold)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

export const FilterButton = (props: Props) => (
  <MainContainer onPress={props.onPress} isSelected={props.isSelected}>
    <StyledText isSelected={props.isSelected}>{props.text}</StyledText>
  </MainContainer>
);
