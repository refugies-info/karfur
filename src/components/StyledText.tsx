import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

const StyledText = styled((props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <Text {...props} isRTL={isRTL} selectable />;
})`
  text-align: ${({ theme }) => (theme.i18n.isRTL ? "right" : "left")};
  color: ${({ theme, color }) => color || theme.colors.black};
`;

export const StyledTextNormal = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.normal}px;
  font-family: ${({ theme }) => theme.fonts.families.circularStandard};
  line-height: 24px;
`;

export const StyledTextNormalBold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.normal}px;
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  line-height: 24px;
`;

export const StyledTextSmall = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.small}px;
  font-family: ${({ theme }) => theme.fonts.families.circularStandard};
  line-height: 20px;
`;

export const StyledTextSmallBold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.small}px;
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  line-height: 20px;
`;

export const StyledTextVerySmall = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.verySmall}px;
  font-family: ${({ theme }) => theme.fonts.families.circularStandard};
  line-height: 16px;
`;

export const StyledTextVerySmallBold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.verySmall}px;
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  line-height: 16px;
`;

export const StyledTextBig = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.big}px;
  font-family: ${({ theme }) => theme.fonts.families.circularStandard};
  line-height: 32px;
`;

export const StyledTextBigBold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.big}px;
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  line-height: 32px;
`;

// For back-compatibility
export {
  StyledTextBig as TextBig,
  StyledTextBigBold as TextBigBold,
  StyledTextNormal as TextNormal,
  StyledTextNormalBold as TextNormalBold,
  StyledTextSmall as TextSmallNormal,
  StyledTextSmallBold as TextSmallBold,
  StyledTextVerySmall as TextVerySmallNormal,
  StyledTextVerySmallBold as TextVerySmallBold,
};
