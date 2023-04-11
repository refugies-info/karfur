import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Icon } from "../../iconography";
import { Columns } from "../../layout";

const ICON_SIZE = 24;

export interface ButtonProps {
  accessibilityLabel: string;
  color?: string;
  disabled?: boolean;
  disabledColor?: string;
  iconColor?: string;
  iconName?: string;
  loading?: boolean;
  onPress: TouchableOpacityProps["onPress"];
  title: string;
}

const ButtonText = styled.Text<{
  color: string;
  disabled: boolean;
  disabledColor: string;
}>`
  color: ${({ color, disabledColor, disabled }) =>
    disabled ? disabledColor : color};
  font-family: ${({ theme }) => theme.fonts.button.family};
  font-size: ${({ theme }) => theme.fonts.button.size};
  font-weight: ${({ theme }) => theme.fonts.button.weight};
`;

const Container = styled.View<{
  backgroundColor: string;
  disabledBackgroundColor: string;
  disabled: boolean;
  borderColor?: string;
  disabledBorderColor: string;
}>`
  background-color: ${({
    backgroundColor,
    disabledBackgroundColor,
    disabled,
  }) => (disabled ? disabledBackgroundColor : backgroundColor)};
  border-color: ${({ borderColor, disabledBorderColor, disabled, theme }) =>
    disabled ? disabledBorderColor : borderColor || theme.colors.black};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  border-width: 1px;
  padding: ${({ theme }) => theme.radius * 2}px;
  min-height: 44px;
  ${({ theme }) => theme.shadows.lg}
`;

const Button = ({
  accessibilityLabel,
  color,
  disabled = false,
  disabledColor,
  iconColor,
  iconName,
  loading = false,
  onPress,
  title,
}: ButtonProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      onPress={loading ? () => null : onPress}
      disabled={disabled || loading}
    >
      <Container
        backgroundColor="transparent"
        disabledBackgroundColor="gray"
        disabled={disabled}
        borderColor={color}
        disabledBorderColor="gray"
      >
        <Columns layout="auto">
          {iconName && (
            <Icon
              color={color || theme.colors.black}
              loading={loading}
              name={iconName}
              size={ICON_SIZE}
            />
          )}
          <ButtonText
            color={iconColor || color || theme.colors.black}
            disabledColor={disabledColor || theme.colors.greyDisabled}
            disabled={disabled || loading}
          >
            {title}
          </ButtonText>
        </Columns>
      </Container>
    </TouchableOpacity>
  );
};

export default Button;
