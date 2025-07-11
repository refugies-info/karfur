import isNull from "lodash/isNull";
import React, { PropsWithChildren, ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { isLastChild } from "../../utils";
import { FlexItem, getFlexValue } from "../common";
import Separator from "../Separator";

const RowsWrapper = styled.View<{
  horizontalAlign?: string;
  verticalAlign?: string;
}>`
  flex-grow: 1;
  flex-basis: auto;
  flex-direction: column;
  ${({ verticalAlign }) => verticalAlign && `justify-content: ${verticalAlign}`};
  ${({ horizontalAlign }) => horizontalAlign && `align-items: ${horizontalAlign}`};
`;

export enum RowsSpacing {
  // eslint-disable-next-line no-unused-vars
  Default = "default",
  // eslint-disable-next-line no-unused-vars
  NoSpace = "nospace",
  // eslint-disable-next-line no-unused-vars
  Text = "text",
}

export type RowsProps = PropsWithChildren<{
  horizontalAlign?: string;
  verticalAlign?: string;
  layout?: string;
  spacing?: RowsSpacing;
  separator?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

const Rows = ({
  children,
  horizontalAlign,
  verticalAlign,
  layout = "auto",
  spacing = RowsSpacing.Default,
  style,
  separator = false,
}: RowsProps) => {
  const _children = React.Children.toArray(children).filter((child: ReactNode) => !isNull(child));
  return (
    <RowsWrapper horizontalAlign={horizontalAlign} verticalAlign={verticalAlign} style={style}>
      {React.Children.map(
        _children,
        (child: ReactNode, index: number) =>
          child && (
            <FlexItem
              flex={getFlexValue(layout, index)}
              key={index}
              marginBottom={!isLastChild(_children, index) ? spacing : undefined}
            >
              {child}
              {separator && !isLastChild(_children, index) && <Separator fullWidth />}
            </FlexItem>
          ),
      )}
    </RowsWrapper>
  );
};

Rows.displayName = "Rows";

export default Rows;
