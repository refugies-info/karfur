import * as React from "react";
import styled from "styled-components/native";
import { StyleProp, TextStyle } from "react-native";
import { RTLTouchableOpacity } from "./BasicComponents";
import { styles } from "../theme";
import { TextDSFR_MD_Bold, TextDSFR_MD } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";
import { ReadableText } from "./ReadableText";
import { useTheme } from "styled-components/native";

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
  ${({ isDisabled, withShadows, theme }) =>
    isDisabled || !withShadows ? "" : theme.shadows.sm};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
`;

const ColoredTextBold = styled(TextDSFR_MD_Bold)<{
  textColor: string;
  isRTL: boolean;
  iconFirst: boolean;
  hasIcon: boolean;
}>`
  color: ${({ textColor }) => textColor};
  margin-left: ${({ isRTL, iconFirst, hasIcon }) =>
    hasIcon && (iconFirst || isRTL) && isRTL !== iconFirst
      ? styles.margin
      : 0}px;
  margin-right: ${({ isRTL, iconFirst, hasIcon }) =>
    hasIcon && isRTL === iconFirst ? styles.margin : 0}px;
`;

const ColoredTextNormal = styled(TextDSFR_MD)<{
  textColor: string;
  isRTL: boolean;
  iconFirst: boolean;
  hasIcon: boolean;
}>`
  color: ${({ textColor }) => textColor};
  margin-left: ${({ isRTL, iconFirst, hasIcon }) =>
    hasIcon && (iconFirst || isRTL) && isRTL !== iconFirst
      ? styles.margin
      : 0}px;
  margin-right: ${({ isRTL, iconFirst, hasIcon }) =>
    hasIcon && isRTL === iconFirst ? styles.margin : 0}px;
`;

interface Props {
  accessibilityLabel?: string;
  backgroundColor?: string;
  defaultText: string;
  i18nKey: string;
  iconFirst?: boolean;
  iconName?: string;
  iconSize?: number;
  iconStyle?: any;
  isDisabled?: boolean;
  isSmall?: boolean;
  isTextNotBold?: boolean;
  notFullWidth?: boolean;
  onPress: () => void;
  readableOverridePosY?: number;
  style?: any;
  textColor: string;
  textStyle?: StyleProp<TextStyle>;
  withShadows?: boolean;
}

const ICON_SIZE = 24;

export const CustomButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const theme = useTheme();
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
      accessible={true}
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
          <ReadableText
            overridePosY={props.readableOverridePosY}
            darkBg={props.textColor === theme.colors.white ? true : false}
          >
            {t(props.i18nKey, props.defaultText)}
          </ReadableText>
        </ColoredTextNormal>
      ) : (
        <ColoredTextBold
          textColor={props.textColor}
          isRTL={isRTL}
          iconFirst={!!props.iconFirst}
          hasIcon={!!props.iconName}
          style={props.textStyle || {}}
        >
          <ReadableText
            overridePosY={props.readableOverridePosY}
            darkBg={props.textColor === theme.colors.white ? true : false}
          >
            {t(props.i18nKey, props.defaultText)}
          </ReadableText>
        </ColoredTextBold>
      )}
      {props.iconName && !props.iconFirst && icon}
    </ButtonContainer>
  );
};
