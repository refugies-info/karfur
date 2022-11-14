import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

// We should use type-converting comparison (eqeq aka ==) because parseFloat will compute an invalid Float for case like: "8px" => 8
// eslint-disable-next-line eqeqeq
const isFloat = (value: any) => parseFloat(value) == value;

// TODO: marginBotton and marginRight API are perfectible: it's already declared as an update tech task in our backlog !
const FlexItem = styled(({ style, children }) => (
  <View style={style}>{children}</View>
))<{ flex?: string; marginBottom?: string; marginRight?: string }>`
  flex-grow: ${({ flex }) => (isFloat(flex) ? flex : 0)};
  flex-basis: ${({ flex }) => (!isFloat(flex) ? flex : 0)};
  ${({ marginBottom, theme }) =>
    marginBottom && `margin-bottom: ${theme.layout.columns[marginBottom]}`};
  ${({ marginHorizontal, theme }) =>
    marginHorizontal &&
    (theme.i18n.isRTL
      ? `margin-left: ${theme.layout.rows[marginHorizontal]}`
      : `margin-right: ${theme.layout.rows[marginHorizontal]}`)};
`;

export default FlexItem;
