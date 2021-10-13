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
  color: ${theme.colors.black};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  font-size: ${theme.fonts.sizes.normal}px;
  font-family: ${theme.fonts.families.circularBold};
  line-height: 24px;
  color: ${theme.colors.black};
`;

export const StyledTextSmall = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
  color: ${theme.colors.black};
`;

export const StyledTextSmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.small}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
  flex-shrink: 1;
  color: ${theme.colors.black};
`;

export const StyledTextVerySmall = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
  color: ${theme.colors.black};
`;

export const StyledTextVerySmallBold = styled.Text`
  font-size: ${theme.fonts.sizes.verySmall}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
  color: ${theme.colors.black};
`;

export const StyledTextBig = styled.Text`
  font-size: ${theme.fonts.sizes.big}px;
  font-family: ${theme.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
  color: ${theme.colors.black};
`;

export const StyledTextBigBold = styled.Text`
  font-size: ${theme.fonts.sizes.big}px;
  font-family: ${theme.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
  color: ${theme.colors.black};
`;

export const TextNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <StyledTextNormal isRTL={isRTL} selectable={true} {...props} />;
};

export const TextNormalBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextNormalBold isRTL={isRTL} selectable={true} {...props} />;
};

export const TextBig = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <StyledTextBig isRTL={isRTL} selectable={true} {...props} />;
};

export const TextBigBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextBigBold isRTL={isRTL} selectable={true} {...props} />;
};

export const TextVerySmallNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextVerySmall isRTL={isRTL} selectable={true} {...props} />;
};

export const TextVerySmallBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextVerySmallBold isRTL={isRTL} selectable={true} {...props} />;
};

export const TextSmallNormal = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextSmall isRTL={isRTL} selectable={true} {...props} />;
};

export const TextSmallBold = (props: any) => {
  const { isRTL } = useTranslationWithRTL();

  return <StyledTextSmallBold isRTL={isRTL} selectable={true} {...props} />;
};
