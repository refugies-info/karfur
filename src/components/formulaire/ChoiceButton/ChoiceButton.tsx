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
      ? theme.colors.lightBlue
      : flatStyle
      ? "transparent"
      : theme.colors.white};
  ${({ selected, flatStyle, theme }) =>
    selected || flatStyle ? "" : theme.shadows.lg};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  margin-bottom: ${({ flatStyle, theme }) =>
    !flatStyle ? theme.margin * 3 : 0}px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.margin * 2 - 2}px;
  border-width: 2px;
  border-color: ${({ selected, flatStyle, theme }) =>
    selected
      ? theme.colors.darkBlue
      : flatStyle
      ? "transparent"
      : theme.colors.white};
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
      <Columns RTLBehaviour layout="1 auto" verticalAlign="center">
        {children}
        {!hideRadio && (
          <RadioButton selected={isSelected}>
            {isSelected && (
              <Icon
                name="checkmark-outline"
                width={16}
                height={16}
                fill={theme.colors.white}
              />
            )}
          </RadioButton>
        )}
      </Columns>
    </MainContainer>
  );
};

export default ChoiceButton;
