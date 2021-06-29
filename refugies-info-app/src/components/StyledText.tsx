import styled from "styled-components/native";
import { theme } from "../theme";
import React from "react";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

export const StyledTextNormal = styled.Text`
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 24px;
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularBold};
  line-height: 24px;
`;

export const StyledTextSmall = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
`;

export const StyledTextSmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
`;

export const StyledTextVerySmall = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
`;

export const StyledTextVerySmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
`;

export const StyledTextBig = styled.Text`
  font-size: ${theme.fonts.sizes.big}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
`;

export const StyledTextBigBold = styled.Text`
  font-size: ${theme.fonts.sizes.big}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
`;

export const TextNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <StyledTextNormal isRTL={isRTL} {...props} />;
};

export const TextNormalBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextNormalBold isRTL={isRTL} {...props} />;
};

export const TextBig = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <StyledTextBig isRTL={isRTL} {...props} />;
};

export const TextBigBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextBigBold isRTL={isRTL} {...props} />;
};

export const TextVerySmallNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextVerySmall isRTL={isRTL} {...props} />;
};

export const TextVerySmallBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextVerySmallBold isRTL={isRTL} {...props} />;
};

export const TextSmallNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextSmall isRTL={isRTL} {...props} />;
};

export const TextSmallBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextSmallBold isRTL={isRTL} {...props} />;
};
