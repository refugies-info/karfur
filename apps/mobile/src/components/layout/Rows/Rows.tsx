/* eslint-disable react/require-default-props */ // props are optionnal
import isNull from "lodash/isNull";
import React, { ReactNode } from "react";
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
  separator?: boolean;
  style?: StyleProp<ViewStyle>;
}

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
    <RowsWrapper
      horizontalAlign={horizontalAlign}
      verticalAlign={verticalAlign}
      //@ts-ignore
      style={style}
    >
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
