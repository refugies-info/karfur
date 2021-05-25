import styled from "styled-components/native";
import i18n from "../services/i18n";
import { theme } from "../theme";

export const StyledTextNormal = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.normal.fontSize}px;
  font-family: ${theme.fonts.normal.fontFamily};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.normalBold.fontSize}px;
  font-family: ${theme.fonts.normalBold.fontFamily};
`;

export const StyledTextSmall = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.small.fontSize}px;
  font-family: ${theme.fonts.small.fontFamily};
`;

export const StyledTextSmallBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.smallBold.fontSize}px;
  font-family: ${theme.fonts.smallBold.fontFamily};
`;

export const StyledTextVerySmall = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.verySmall.fontSize}px;
  font-family: ${theme.fonts.verySmall.fontFamily};
`;

export const StyledTextVerySmallBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.verySmallBold.fontSize}px;
  font-family: ${theme.fonts.verySmallBold.fontFamily};
`;
