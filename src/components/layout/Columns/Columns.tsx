import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { FlexItem, getFlexValue } from "../common";
import { isLastChild } from "../../utils";

const ColumnsWrapper = styled.View<{
  horizontalAlign?: string;
  RTLBehaviour: boolean;
  verticalAlign?: string;
}>`
  flex-grow: 1;
  flex-basis: auto;
  flex-direction: ${({ theme, RTLBehaviour }) =>
    RTLBehaviour && theme.i18n.isRTL ? "row-reverse" : "row"};
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
  layout?: string;
  RTLBehaviour?: boolean;
  spacing?: ColumnsSpacing;
  verticalAlign?: string;
}

const Columns = ({
  children,
  horizontalAlign = "flex-start",
  layout = "1",
  RTLBehaviour = false,
  spacing = ColumnsSpacing.Default,
  verticalAlign = "flex-start",
}: ColumnsProps) => (
  <ColumnsWrapper
    horizontalAlign={horizontalAlign}
    RTLBehaviour={RTLBehaviour}
    verticalAlign={verticalAlign}
  >
    {React.Children.map(children, (child, index) => (
      <FlexItem
        flex={getFlexValue(layout, index)}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        RTLBehaviour={RTLBehaviour}
        marginHorizontal={!isLastChild(children, index) && spacing}
      >
        {child}
      </FlexItem>
    ))}
  </ColumnsWrapper>
);

export default Columns;
