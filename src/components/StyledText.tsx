import styled from "styled-components/native";
import { styles } from "../theme";
import React from "react";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

export const StyledTextNormal = styled.Text`
  font-size: ${styles.fonts.sizes.normal}px;
  font-family: ${styles.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 24px;
  color: ${styles.colors.black};
`;

export const StyledTextNormalBold = styled.Text`
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  font-size: ${styles.fonts.sizes.normal}px;
  font-family: ${styles.fonts.families.circularBold};
  line-height: 24px;
  color: ${styles.colors.black};
`;

export const StyledTextSmall = styled.Text`
  font-size: ${styles.fonts.sizes.small}px;
  font-family: ${styles.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
  color: ${styles.colors.black};
`;

export const StyledTextSmallBold = styled.Text`
  font-size: ${styles.fonts.sizes.small}px;
  font-family: ${styles.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 20px;
  flex-shrink: 1;
  color: ${styles.colors.black};
`;

export const StyledTextVerySmall = styled.Text`
  font-size: ${styles.fonts.sizes.verySmall}px;
  font-family: ${styles.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
  color: ${styles.colors.black};
`;

export const StyledTextVerySmallBold = styled.Text`
  font-size: ${styles.fonts.sizes.verySmall}px;
  font-family: ${styles.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 16px;
  color: ${styles.colors.black};
`;

export const StyledTextBig = styled.Text`
  font-size: ${styles.fonts.sizes.big}px;
  font-family: ${styles.fonts.families.circularStandard};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
  color: ${styles.colors.black};
`;

export const StyledTextBigBold = styled.Text`
  font-size: ${styles.fonts.sizes.big}px;
  font-family: ${styles.fonts.families.circularBold};
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  line-height: 32px;
  color: ${styles.colors.black};
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
