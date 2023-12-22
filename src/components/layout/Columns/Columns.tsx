import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { FlexItem, getFlexValue } from "../common";
import { isLastChild } from "../../utils";
import { Animated, StyleProp, ViewStyle } from "react-native";

const ColumnsWrapper = styled(Animated.View)<{
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
  Large = "large",
  XLarge = "xlarge",
  NoSpace = "nospace",
}

export interface ColumnsProps {
  children: ReactNode;
  horizontalAlign?: string;
  layout?: string;
  RTLBehaviour?: boolean;
  spacing?: ColumnsSpacing;
  verticalAlign?: string;
  style?: StyleProp<ViewStyle>;
}

const Columns = ({
  children,
  horizontalAlign = "flex-start",
  layout = "1",
  RTLBehaviour = false,
  spacing = ColumnsSpacing.Default,
  verticalAlign = "flex-start",
  style,
}: ColumnsProps) => {
  return (
    <ColumnsWrapper
      horizontalAlign={horizontalAlign}
      RTLBehaviour={RTLBehaviour}
      verticalAlign={verticalAlign}
      //@ts-ignore
      style={style}
    >
      {React.Children.map(children, (child, index) =>
        child !== null ? (
          <FlexItem
            flex={getFlexValue(layout, index)}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            RTLBehaviour={RTLBehaviour}
            marginHorizontal={!isLastChild(children, index) && spacing}
          >
            {child}
          </FlexItem>
        ) : null
      )}
    </ColumnsWrapper>
  );
};

export default Columns;
