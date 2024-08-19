import React from "react";
import styled, { useTheme } from "styled-components/native";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { Icon } from "react-native-eva-icons";
import Columns from "../../layout/Columns";
import RadioButton from "../RadioButton";

export interface ChoiceButtonProps {
  accessibilityRole?: "button" | "radio";
  children: any;
  flatStyle?: boolean;
  hideRadio?: boolean;
  iconOverride?: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
  testID: string;
}

const MainContainer = styled(RTLTouchableOpacity)<{
  flatStyle: boolean;
  selected: boolean;
}>`
  background-color: ${({ selected, flatStyle, theme }) =>
    selected
      ? theme.colors.dsfr_actionLowBlue
      : flatStyle
      ? "transparent"
      : theme.colors.white};
  ${({ selected, flatStyle, theme }) =>
    selected || flatStyle ? "" : theme.shadows.sm_dsfr};
  margin-bottom: ${({ flatStyle, theme }) =>
    !flatStyle ? theme.margin * 3 : 0}px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.margin * 2}px;
  border-width: 1px;
  border-color: ${({ selected, flatStyle, theme }) =>
    selected
      ? theme.colors.dsfr_action
      : flatStyle
      ? "transparent"
      : theme.colors.dsfr_borderGrey};
`;

export const ChoiceButton = ({
  accessibilityRole = "radio",
  children,
  flatStyle = false,
  hideRadio = false,
  isSelected,
  onPress,
  style = {},
  testID,
  iconOverride,
}: ChoiceButtonProps) => {
  const theme = useTheme();
  return (
    <MainContainer
      accessibilityRole={accessibilityRole}
      flatStyle={!!flatStyle}
      onPress={onPress}
      selected={isSelected}
      style={style}
      testID={testID}
    >
      <Columns RTLBehaviour layout="1 auto auto" verticalAlign="center">
        {children}
        {!hideRadio && <RadioButton isSelected={isSelected} />}
        {!!iconOverride && (
          <Icon
            name={iconOverride}
            width={24}
            height={24}
            fill={
              isSelected ? theme.colors.dsfr_action : theme.colors.dsfr_dark
            }
          />
        )}
      </Columns>
    </MainContainer>
  );
};

export default ChoiceButton;
