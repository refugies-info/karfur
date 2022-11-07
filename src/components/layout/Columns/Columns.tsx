import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { FlexItem, getFlexValue } from "../common";
import { isLastChild } from "../../utils";

const ColumnsWrapper = styled.View<{
  horizontalAlign?: string;
  verticalAlign?: string;
}>`
  flex-grow: 1;
  flex-basis: auto;
  flex-direction: row;
  ${({ verticalAlign }) => verticalAlign && `align-items: ${verticalAlign}`};
  ${({ horizontalAlign }) =>
    horizontalAlign && `justify-content: ${horizontalAlign}`};
`;

export enum ColumnsSpacing {
  Default = "default",
  NoSpace = "nospace",
}

export interface ColumnsProps {
  children: ReactNode;
  horizontalAlign?: string;
  verticalAlign?: string;
  layout?: string;
  spacing?: ColumnsSpacing;
}

const Columns = ({
  children,
  horizontalAlign = "flex-start",
  verticalAlign = "flex-start",
  layout = "1",
  spacing = ColumnsSpacing.Default,
}: ColumnsProps) => (
  <ColumnsWrapper
    horizontalAlign={horizontalAlign}
    verticalAlign={verticalAlign}
  >
    {React.Children.map(children, (child, index) => (
      <FlexItem
        flex={getFlexValue(layout, index)}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        marginRight={!isLastChild(children, index) && spacing}
      >
        {child}
      </FlexItem>
    ))}
  </ColumnsWrapper>
);

export default Columns;
