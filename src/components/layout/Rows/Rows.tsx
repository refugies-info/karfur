/* eslint-disable react/require-default-props */ // props are optionnal
import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { FlexItem, getFlexValue } from "../common";
import { isLastChild } from "../../utils";

const RowsWrapper = styled.View<{
  horizontalAlign?: string;
  verticalAlign?: string;
}>`
  flex-grow: 1;
  flex-basis: auto;
  flex-direction: column;
  ${({ verticalAlign }) =>
    verticalAlign && `justify-content: ${verticalAlign}`};
  ${({ horizontalAlign }) =>
    horizontalAlign && `align-items: ${horizontalAlign}`};
`;

export enum RowsSpacing {
  Default = "default",
  NoSpace = "nospace",
}

export interface RowsProps {
  children: ReactNode;
  horizontalAlign?: string;
  verticalAlign?: string;
  layout?: string;
  spacing?: RowsSpacing;
}

const Rows = ({
  children,
  horizontalAlign,
  verticalAlign,
  layout = "auto",
  spacing = RowsSpacing.Default,
}: RowsProps) => (
  <RowsWrapper horizontalAlign={horizontalAlign} verticalAlign={verticalAlign}>
    {React.Children.map(
      children,
      (child, index) =>
        child && (
          <FlexItem
            flex={getFlexValue(layout, index)}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            marginBottom={!isLastChild(children, index) && spacing}
          >
            {child}
          </FlexItem>
        )
    )}
  </RowsWrapper>
);

export default Rows;
