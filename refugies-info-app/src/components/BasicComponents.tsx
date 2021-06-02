import styled from "styled-components/native";
import React from "react";
import i18n from "../services/i18n";

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
`;
export const RTLView = (props: any) => (
  <RTLViewContainer isRTL={i18n.isRTL()} {...props} />
);

const RTLTouchableOpacityContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
`;
export const RTLTouchableOpacity = (props: any) => (
  <RTLTouchableOpacityContainer isRTL={i18n.isRTL()} {...props} />
);
