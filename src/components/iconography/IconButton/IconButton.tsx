import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled, { useTheme } from "styled-components/native";
import Icon from "../Icon";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  padding: ${({ theme }) => theme.radius * 2}px;
  width: 48px;
  ${({ theme }) => theme.shadows.lg}
`;

const ICON_SIZE = 24;

export interface IconButtonProps {
  accessibilityLabel: string;
  color: string;
  iconName: string;
  onPress: TouchableOpacityProps["onPress"];
}

const IconButton = ({
  accessibilityLabel,
  color,
  iconName,
  onPress,
}: IconButtonProps) => {
  const theme = useTheme();
  return (
    <ButtonContainer
      onPress={onPress}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon
        name={iconName}
        size={ICON_SIZE}
        color={color || theme.colors.black}
      />
    </ButtonContainer>
  );
};

export default IconButton;
