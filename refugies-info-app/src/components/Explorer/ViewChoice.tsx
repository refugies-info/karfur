import { RTLTouchableOpacity } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { theme } from "../../theme";
import React from "react";
import styled from "styled-components/native";
import { TextVerySmallBold, TextVerySmallNormal } from "../StyledText";

const ICON_SIZE = 16;

const ChoiceTextBold = styled(TextVerySmallBold)`
  margin-left: ${theme.margin}px;
  margin-right: ${theme.margin}px;
`;

const ChoiceText = styled(TextVerySmallNormal)`
  margin-left: ${theme.margin}px;
  margin-right: ${theme.margin}px;
  color: ${theme.colors.darkGrey};
`;

const StyledButton = styled(RTLTouchableOpacity)`
  margin-left: ${theme.margin * 3}px;
  margin-right: ${theme.margin * 3}px;
`;
interface Props {
  text: string;
  isSelected: boolean;
  iconName: string;
  onPress: () => void;
}
export const ViewChoice = (props: Props) => (
  <StyledButton onPress={props.onPress}>
    <Icon
      name={props.isSelected ? props.iconName : props.iconName + "-outline"}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={props.isSelected ? theme.colors.black : theme.colors.darkGrey}
    />
    {props.isSelected ? (
      <ChoiceTextBold>{props.text}</ChoiceTextBold>
    ) : (
      <ChoiceText>{props.text}</ChoiceText>
    )}
  </StyledButton>
);
