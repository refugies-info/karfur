import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { ColumnsSpacing } from "../../Columns";

// We should use type-converting comparison (eqeq aka ==) because parseFloat will compute an invalid Float for case like: "8px" => 8
// eslint-disable-next-line eqeqeq
const isFloat = (value: any) => parseFloat(value) == value;

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: any;
  flex?: string;
  RTLBehaviour?: boolean;
  marginHorizontal?: ColumnsSpacing;
  marginBottom?: "nospace" | "default" | "text";
}
// TODO: marginBotton and marginRight API are perfectible: it's already declared as an update tech task in our backlog !
const FlexItem = styled(({ style, children }: Props) => (
  <View style={style}>{children}</View>
))<{
  flex?: string;
  marginBottom?: "nospace" | "default" | "text";
  marginRight?: string;
}>`
  flex-grow: ${({ flex }) => (isFloat(flex) ? flex : 0)};
  flex-basis: ${({ flex }) => (!isFloat(flex) ? flex : 0)};
  ${({ marginBottom, theme }) =>
    marginBottom && `margin-bottom: ${theme.layout.rows[marginBottom]}`};
  ${({ marginHorizontal, RTLBehaviour, theme }) =>
    marginHorizontal &&
    (theme.i18n.isRTL && RTLBehaviour
      ? `margin-left: ${theme.layout.columns[marginHorizontal]}`
      : `margin-right: ${theme.layout.columns[marginHorizontal]}`)};
`;

export default FlexItem;
