/* eslint-disable react/require-default-props */ // props are optionnal
import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { FlexItem, getFlexValue } from "../common";
import { isLastChild } from "../../utils";
import { isNull } from "lodash";

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
  Text = "text",
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
}: RowsProps) => {
  const _children = React.Children.toArray(children).filter(
    (child: ReactNode) => !isNull(child)
  );
  return (
    <RowsWrapper
      horizontalAlign={horizontalAlign}
      verticalAlign={verticalAlign}
    >
      {React.Children.map(
        _children,
        (child: ReactNode, index: number) =>
          child && (
            <FlexItem
              flex={getFlexValue(layout, index)}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              marginBottom={!isLastChild(_children, index) && spacing}
            >
              {child}
            </FlexItem>
          )
      )}
    </RowsWrapper>
  );
};

Rows.displayName = "Rows";

export default Rows;
