import { Picture } from "@refugies-info/api-types";
import React, { ComponentType, memo, useMemo } from "react";
import { ImageBackground, View } from "react-native";
import styled from "styled-components/native";
import { getImageUri } from "../../../libs/getImageUri";
import { PropsOf } from "../../../utils";
import { HeaderContentProps } from "../Header";
import SafeAreaViewTopInset from "../SafeAreaViewTopInset";

export interface PageHeaderProps {
  headerBackgroundColor?: string;
  headerBackgroundImage?: Picture;
  HeaderContent?: ComponentType<HeaderContentProps>;
  isDarkBackground: boolean;
  onHeaderLayout: (e: any) => any;
  HeaderContentInternal: React.ComponentType<HeaderContentProps>;
  style?: any;
}

const MainContainer = styled(SafeAreaViewTopInset)<{
  backgroundColor?: string;
  showShadow?: boolean;
  rounded: boolean;
}>`
  z-index: 4;
  ${({ showShadow, theme }) => (showShadow ? theme.shadows.xs : "")}
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ theme }) => theme.layout.content.normal};
  min-height: ${({ theme }) => theme.layout.header.minHeight + theme.insets.top}px;
  width: 100%;
  padding-top: ${({ theme }) => theme.layout.header.minHeight + theme.margin}px;
  border-bottom-right-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
  border-bottom-left-radius: ${({ rounded }) => (rounded ? 12 : 0)}px;
`;

const PageHeader = memo(function PageHeader({
  onHeaderLayout,
  headerBackgroundColor,
  headerBackgroundImage,
  isDarkBackground,
  HeaderContentInternal,
  style,
}: PageHeaderProps) {
  const Container = useMemo(() => {
    const component: React.FC<React.PropsWithChildren<PropsOf<typeof ImageBackground | typeof View>>> = ({
      children,
      ...other
    }) => {
      return headerBackgroundImage ? (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: getImageUri(headerBackgroundImage.secure_url) }}
          style={{ height: 240 }}
        >
          {children}
        </ImageBackground>
      ) : (
        <View {...other}>{children}</View>
      );
    };
    return component;
  }, [headerBackgroundImage]);

  return (
    <Container onLayout={onHeaderLayout} style={style}>
      <MainContainer
        backgroundColor={headerBackgroundImage ? "rgba(255,255,255,0)" : headerBackgroundColor}
        rounded={!!(headerBackgroundImage || headerBackgroundColor)}
      >
        <HeaderContentInternal darkBackground={isDarkBackground} />
      </MainContainer>
    </Container>
  );
});

export default PageHeader;
