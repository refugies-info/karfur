import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { theme } from "../theme";
import { StyledTextSmallBold, StyledTextSmall } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";

const ButtonContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor || theme.colors.white};
  justify-content: center;
  padding: ${(props: { isSmall: boolean }) =>
    !props.isSmall ? theme.radius * 3 : theme.margin}px;
  border-radius: ${(props: { isSmall: boolean }) =>
    !props.isSmall ? theme.radius * 2 : theme.radius * 4}px;
  align-items: center;
  width: ${(props: { notFullWidth: boolean }) =>
    props.notFullWidth ? "auto" : "100%"};
  height: ${(props: { isSmall: boolean }) =>
    !props.isSmall ? 56 : 40}px;
  box-shadow: ${(props: { isDisabled: boolean }) =>
    props.isDisabled
      ? `0px 0px 0px ${theme.colors.grey}`
      : "0px 8px 16px rgba(33, 33, 33, 0.24)"};
  elevation: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? 0 : 1};
  opacity: ${(props: { isDisabled: boolean }) =>
    props.isDisabled ? 0.4 : 1};
`;

const ColoredTextBold = styled(StyledTextSmallBold)`
  color: ${(props: { textColor: string }) => props.textColor};
  margin-left: ${(props: { isRTL: boolean, iconFirst: boolean, hasIcon: boolean }) =>
    props.hasIcon && (props.iconFirst || props.isRTL) && (props.isRTL !== props.iconFirst) ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean, iconFirst: boolean, hasIcon: boolean }) =>
    props.hasIcon && props.isRTL === props.iconFirst ? theme.margin : 0}px;
`;

const ColoredTextNormal = styled(StyledTextSmall)`
  color: ${(props: { textColor: string }) => props.textColor};
  margin-left: ${(props: { isRTL: boolean, iconFirst: boolean, hasIcon: boolean }) =>
    props.hasIcon && (props.iconFirst || props.isRTL) && (props.isRTL !== props.iconFirst) ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean, iconFirst: boolean, hasIcon: boolean }) =>
    props.hasIcon && props.isRTL === props.iconFirst ? theme.margin : 0}px;
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
  style?: any;
  iconStyle?: any;
  accessibilityLabel?: string;
}

const ICON_SIZE = 24;

export const CustomButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const icon = <Icon
    name={props.iconName}
    width={ICON_SIZE}
    height={ICON_SIZE}
    fill={props.textColor}
    style={props.iconStyle || {}}
  />;

  return (
    <ButtonContainer
      onPress={props.onPress}
      backgroundColor={props.backgroundColor}
      isDisabled={props.isDisabled}
      disabled={props.isDisabled}
      isSmall={props.isSmall}
      testID={"test-custom-button-" + props.defaultText}
      notFullWidth={props.notFullWidth}
      style={props.style || {}}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
    >
      {props.iconName && props.iconFirst && icon}
      {props.isTextNotBold ? (
        <ColoredTextNormal
          textColor={props.textColor}
          isRTL={isRTL}
          iconFirst={!!props.iconFirst}
          hasIcon={!!props.iconName}
        >
          {t(props.i18nKey, props.defaultText)}
        </ColoredTextNormal>
      ) : (
        <ColoredTextBold
          textColor={props.textColor}
          isRTL={isRTL}
          iconFirst={!!props.iconFirst}
          hasIcon={!!props.iconName}
        >
          {t(props.i18nKey, props.defaultText)}
        </ColoredTextBold>
      )}
      {props.iconName && !props.iconFirst && icon}
    </ButtonContainer>
  );
};
