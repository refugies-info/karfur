import * as React from "react";
import styled from "styled-components/native";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { styles } from "../theme";
import { StyledTextSmallBold, StyledTextSmall } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor || styles.colors.white};
  justify-content: center;
  padding: ${(props: { isSmall: boolean }) =>
    !props.isSmall ? styles.radius * 3 : styles.margin}px;
  border-radius: ${(props: { isSmall: boolean }) =>
    !props.isSmall ? styles.radius * 2 : 8}px;
  align-items: center;
  width: ${(props: { notFullWidth: boolean }) =>
    props.notFullWidth ? "auto" : "100%"};
  height: ${(props: { isSmall: boolean }) => (!props.isSmall ? 56 : 40)}px;
  ${(props: {
    isDisabled: boolean;
    isSmall: boolean;
    backgroundColor: string;
    withShadows: boolean;
  }) =>
    props.isDisabled || !props.withShadows
      ? ""
      : props.isSmall || !props.backgroundColor
      ? styles.shadows.lg
      : styles.shadows.sm};
  opacity: ${(props: { isDisabled: boolean }) => (props.isDisabled ? 0.4 : 1)};
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
          {t(props.i18nKey, props.defaultText)}
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
