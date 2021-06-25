import styled from "styled-components/native";
import React from "react";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

export const RowContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const RowTouchableOpacity = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RTLViewContainer = styled.View`
  display: flex;
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
  align-items: center;
`;
export const RTLView = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <RTLViewContainer isRTL={isRTL} {...props} />;
};

const RTLTouchableOpacityContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
`;
export const RTLTouchableOpacity = (props: any) => {
  const { isRTL } = useTranslationWithRTL();
  return <RTLTouchableOpacityContainer isRTL={isRTL} {...props} />;
};
