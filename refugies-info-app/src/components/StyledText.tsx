import styled from "styled-components/native";
import i18n from "../services/i18n";
import { theme } from "../theme";
import React from "react";

export const StyledTextNormal = styled.Text`
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularBold};
`;

export const StyledTextSmall = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
`;

export const StyledTextSmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
`;

export const StyledTextVerySmall = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
`;

export const StyledTextVerySmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
`;

export const TextNormal = (props: any) => (
  <StyledTextNormal isRTL={i18n.isRTL()} {...props} />
);

export const TextNormalBold = (props: any) => (
  <StyledTextNormalBold isRTL={i18n.isRTL()} {...props} />
);

export const TextVerySmallNormal = (props: any) => (
  <StyledTextVerySmall isRTL={i18n.isRTL()} {...props} />
);

export const TextVerySmallBold = (props: any) => (
  <StyledTextVerySmallBold isRTL={i18n.isRTL()} {...props} />
);
