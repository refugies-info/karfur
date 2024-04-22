import React, { useMemo } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Icon } from "../../iconography";
import { Columns, ColumnsSpacing } from "../../layout";

const ICON_SIZE = 24;

export interface ButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  iconAfter?: boolean;
  iconName?: string;
  loading?: boolean;
  onPress: TouchableOpacityProps["onPress"];
  title?: string;
  priority: "primary" | "secondary" | "tertiary" | "tertiary no outline";
  size?: "default" | "small";
}

const ButtonText = styled.Text<{
  color: string;
  disabled: boolean;
  size: "default" | "small" | undefined;
}>`
  color: ${({ theme, color, disabled }) =>
    disabled ? theme.colors.dsfr_borderGrey : color};
  font-family: ${({ theme }) => theme.fonts.button.family};
  font-size: ${({ theme, size }) =>
    size === "small" ? theme.fonts.button.sizeSmall : theme.fonts.button.size};
  font-weight: ${({ theme }) => theme.fonts.button.weight};
`;

const Container = styled(TouchableOpacity)<{
  backgroundColor: string;
  borderColor: string;
  disabled: boolean;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-color: ${({ borderColor }) => borderColor};
  border-width: 1px;
  padding: ${({ theme }) => theme.margin * 1.5}px;
  max-height: 50px;
`; // FIXME: max height not clean?

const Button = ({
  accessibilityLabel,
  priority,
  disabled = false,
  iconAfter = false,
  iconName,
  loading = false,
  onPress,
  title,
  size,
}: ButtonProps) => {
  const theme = useTheme();
  const backgroundColor = useMemo(
    () => (priority === "primary" ? theme.colors.dsfr_action : "transparent"),
    [priority]
  );
  const color = useMemo(
    () =>
      priority === "primary" ? theme.colors.white : theme.colors.dsfr_action,
    [priority]
  );
  const borderColor = useMemo(() => {
    switch (priority) {
      case "primary":
        return theme.colors.dsfr_action;
      case "secondary":
        return theme.colors.dsfr_action;
      case "tertiary":
        return theme.colors.dsfr_borderGrey;
      default:
        return "transparent";
    }
  }, [priority]);

  const icon = useMemo(
    () =>
      iconName ? (
        <Icon
          color={color}
          loading={loading}
          name={iconName}
          size={ICON_SIZE}
        />
      ) : null,
    [iconName, color, loading]
  );

  return (
    <Container
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      onPress={loading ? () => {} : onPress}
      disabled={disabled || loading}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    >
      <Columns
        layout="auto"
        spacing={
          !!title && !!icon ? ColumnsSpacing.Default : ColumnsSpacing.NoSpace
        }
      >
        {!iconAfter && icon}
        {title && (
          <ButtonText color={color} disabled={disabled || loading} size={size}>
            {title}
          </ButtonText>
        )}
        {iconAfter && icon}
      </Columns>
    </Container>
  );
};

export default Button;
