import React, { ReactNode } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";
import { firstLetterUpperCase } from "../../../libs";
import { Picture } from "../../../types/interface";
import { ReadableText } from "../../ReadableText";
import { StreamlineIcon } from "../../StreamlineIcon";
import Columns from "../Columns";
import { HeaderContentProps } from "./HeaderContentProps";

const TitleContainer = styled(Animated.View)<{
  showSimplifiedHeader: boolean;
}>`
  justify-content: center;
  min-height: 48px;
  padding-bottom: 8px;
  ${({ showSimplifiedHeader }) =>
    showSimplifiedHeader && " height: 0;   display: none;"}
  overflow: hidden;
`;

const Title = styled(Animated.Text)<{
  hasBackgroundImage?: boolean;
  invertedColor: boolean;
  showSimplifiedHeader: boolean;
}>`
  font-family: ${({ theme }) => theme.fonts.families.circularBold};
  text-align: ${({ theme, showSimplifiedHeader }) =>
    showSimplifiedHeader ? "center" : theme.i18n.isRTL ? "right" : "left"};
  color: ${({ invertedColor, theme }) =>
    invertedColor ? theme.colors.white : theme.colors.black};

  ${({ hasBackgroundImage, theme }) =>
    hasBackgroundImage &&
    `opacity: 0.9;
  background-color: ${theme.colors.white};
  padding: ${theme.margin}px;`}
`;

export interface HeaderContentTitleProps extends HeaderContentProps {
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  headerTooltip?: ReactNode;
  titleIcon?: Picture;
  title: string;
}

const HeaderContentTitle = ({
  animatedController,
  headerBackgroundColor = "transparent",
  headerBackgroundImage,
  headerTooltip,
  showSimplifiedHeader,
  title,
  titleIcon,
}: HeaderContentTitleProps) => {
  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const headerLineHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 20],
  });

  const headerPaddingTop = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 12],
  });

  return (
    <TitleContainer
      style={{
        marginTop: headerPaddingTop,
        height: showSimplifiedHeader ? 0 : "auto",
      }}
      showSimplifiedHeader={showSimplifiedHeader}
    >
      <Columns
        RTLBehaviour
        layout="1 auto"
        verticalAlign="center"
        horizontalAlign="center"
      >
        <Columns
          RTLBehaviour
          layout="auto"
          // horizontalAlign={showSimplifiedHeader ? "center" : "flex-start"}
          verticalAlign="center"
        >
          <Title
            invertedColor={
              (headerBackgroundColor !== "transparent" &&
                headerBackgroundImage === undefined) ||
              (headerBackgroundColor !== "transparent" && showSimplifiedHeader)
            }
            hasBackgroundImage={
              !showSimplifiedHeader && headerBackgroundImage !== undefined
            }
            style={{
              fontSize: headerFontSize,
              lineHeight: headerLineHeight,
            }}
            showSimplifiedHeader={showSimplifiedHeader}
          >
            <ReadableText overridePosY={5}>
              {firstLetterUpperCase(title)}
            </ReadableText>
          </Title>

          {titleIcon && (
            <StreamlineIcon
              icon={titleIcon}
              size={showSimplifiedHeader ? 16 : 24}
            />
          )}
        </Columns>
        {showSimplifiedHeader ? null : headerTooltip || null}
      </Columns>
    </TitleContainer>
  );
};

export default HeaderContentTitle;
