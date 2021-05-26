import styled from "styled-components/native";
import i18n from "../services/i18n";
import { theme } from "../theme";

export const StyledTextNormal = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularStandard};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularBold};
`;

export const StyledTextSmall = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularStandard};
`;

export const StyledTextSmallBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularBold};
`;

export const StyledTextVerySmall = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularStandard};
`;

export const StyledTextVerySmallBold = styled.Text`
  text-align: ${i18n.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularBold};
`;
