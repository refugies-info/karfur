import React, { useMemo } from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Icon } from "../../iconography";
import { Columns, ColumnsSpacing } from "../../layout";
import { ReadableText } from "../../ReadableText";
import { TextDSFR_L_Med } from "../../StyledText";

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
  size?: "default" | "medium" | "small";
  style?: StyleProp<ViewStyle>;
  testID?: string;
  noVoiceover?: boolean;
  externalLink?: boolean;
}

const ButtonText = styled(TextDSFR_L_Med)<{
  color: string;
  disabled: boolean;
  size: "default" | "medium" | "small" | undefined;
}>`
  color: ${({ theme, color, disabled }) =>
    disabled ? theme.colors.dsfr_borderGrey : color};
  ${({ theme, size }) =>
    !!size ? `font-size: ${theme.fonts.button[size]};` : ""}
`;

const Container = styled(TouchableOpacity)<{
  backgroundColor: string;
  borderColor: string;
  disabled: boolean;
  size: "default" | "medium" | "small" | undefined;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-color: ${({ borderColor }) => borderColor};
  border-width: 1px;
  padding-vertical: ${({ theme, size }) =>
    size === "small" || size === "medium"
      ? theme.margin
      : theme.margin * 1.25}px;
  padding-horizontal: ${({ theme, size }) => theme.margin * 1.25}px;
  max-height: 50px;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? "0.4" : "1")};
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
  style,
  testID,
  noVoiceover,
  externalLink,
}: ButtonProps) => {
  const theme = useTheme();
  const backgroundColor = useMemo(() => {
    switch (priority) {
      case "primary":
        return theme.colors.dsfr_action;
      case "tertiary":
        return "white";
      default:
        return "transparent";
    }
  }, [priority]);
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
      size={size}
      style={style}
      testID={testID}
    >
      <Columns
        layout="auto"
        spacing={
          !!title && !!icon ? ColumnsSpacing.Default : ColumnsSpacing.NoSpace
        }
        RTLBehaviour
        verticalAlign="center"
      >
        {!iconAfter && icon}
        {title && (
          <ButtonText color={color} disabled={disabled || loading} size={size}>
            <ReadableText
              isFocused={noVoiceover ? false : undefined}
              darkBg={color === theme.colors.white ? true : false}
            >
              {title}
            </ReadableText>
          </ButtonText>
        )}
        {iconAfter && icon}
        {externalLink && (
          <Icon
            color={color}
            loading={loading}
            name="external-link-outline"
            size={16}
            style={{ marginLeft: theme.margin }}
          />
        )}
      </Columns>
    </Container>
  );
};

export default Button;
