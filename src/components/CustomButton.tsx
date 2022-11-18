import * as React from "react";
import styled from "styled-components/native";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { styles } from "../theme";
import { StyledTextSmallBold, StyledTextSmall } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";
import { ReadableText } from "./ReadableText";

const ButtonContainer = styled(RTLTouchableOpacity)<{
  backgroundColor?: string;
  isSmall?: boolean;
  notFullWidth?: boolean;
  isDisabled?: boolean;
  withShadows: boolean;
}>`
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor || theme.colors.white};
  justify-content: center;
  padding: ${({ isSmall, theme }) =>
    !isSmall ? theme.radius * 3 : theme.margin}px;
  border-radius: ${({ isSmall, theme }) => (!isSmall ? theme.radius * 2 : 8)}px;
  align-items: center;
  width: ${({ notFullWidth }) => (notFullWidth ? "auto" : "100%")};
  ${({ isDisabled, isSmall, backgroundColor, withShadows, theme }) =>
    isDisabled || !withShadows
      ? ""
      : isSmall || !backgroundColor
      ? theme.shadows.lg
      : theme.shadows.sm};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
`;

const ColoredTextBold = styled(StyledTextSmallBold)`
  color: ${(props: { textColor: string }) => props.textColor};
  margin-left: ${(props: {
    isRTL: boolean;
    iconFirst: boolean;
    hasIcon: boolean;
  }) =>
    props.hasIcon &&
    (props.iconFirst || props.isRTL) &&
    props.isRTL !== props.iconFirst
      ? styles.margin
      : 0}px;
  margin-right: ${(props: {
    isRTL: boolean;
    iconFirst: boolean;
    hasIcon: boolean;
  }) =>
    props.hasIcon && props.isRTL === props.iconFirst ? styles.margin : 0}px;
`;

const ColoredTextNormal = styled(StyledTextSmall)`
  color: ${(props: { textColor: string }) => props.textColor};
  margin-left: ${(props: {
    isRTL: boolean;
    iconFirst: boolean;
    hasIcon: boolean;
  }) =>
    props.hasIcon &&
    (props.iconFirst || props.isRTL) &&
    props.isRTL !== props.iconFirst
      ? styles.margin
      : 0}px;
  margin-right: ${(props: {
    isRTL: boolean;
    iconFirst: boolean;
    hasIcon: boolean;
  }) =>
    props.hasIcon && props.isRTL === props.iconFirst ? styles.margin : 0}px;
`;

interface Props {
  textColor: string;
  i18nKey: string;
  onPress: () => void;
  iconName?: string;
  defaultText: string;
  isTextNotBold?: boolean;
  backgroundColor?: string;
  isDisabled?: boolean;
  isSmall?: boolean;
  iconFirst?: boolean;
  notFullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  accessibilityLabel?: string;
  withShadows?: boolean;
}

const ICON_SIZE = 24;

export const CustomButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const { withShadows = true } = props;

  const icon = (
    <Icon
      name={props.iconName}
      width={props.iconSize || ICON_SIZE}
      height={props.iconSize || ICON_SIZE}
      fill={props.textColor}
      style={props.iconStyle || {}}
    />
  );

  return (
    <ButtonContainer
      onPress={props.onPress}
      backgroundColor={props.backgroundColor}
      isDisabled={props.isDisabled}
      disabled={props.isDisabled}
      isSmall={props.isSmall}
      testID={"test-custom-button-" + props.defaultText}
      notFullWidth={props.notFullWidth}
      style={props.style || {}}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      withShadows={withShadows}
    >
      {props.iconName && props.iconFirst && icon}
      {props.isTextNotBold ? (
        <ColoredTextNormal
          textColor={props.textColor}
          isRTL={isRTL}
          iconFirst={!!props.iconFirst}
          hasIcon={!!props.iconName}
          style={props.textStyle || {}}
        >
          <ReadableText>{t(props.i18nKey, props.defaultText)}</ReadableText>
        </ColoredTextNormal>
      ) : (
        <ColoredTextBold
          textColor={props.textColor}
          isRTL={isRTL}
          iconFirst={!!props.iconFirst}
          hasIcon={!!props.iconName}
          style={props.textStyle || {}}
        >
          {t(props.i18nKey, props.defaultText)}
        </ColoredTextBold>
      )}
      {props.iconName && !props.iconFirst && icon}
    </ButtonContainer>
  );
};
