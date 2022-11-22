import { Animated, StyleSheet } from "react-native";
import React from "react";
import styled, { useTheme } from "styled-components/native";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { HeaderContentProps } from "./HeaderContentProps";
import { TextSmallNormal, TextVerySmallNormal } from "../../StyledText";
import { RTLTouchableOpacity, RTLView } from "../../BasicComponents";
import { Picture } from "../../../types/interface";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { ReadableText } from "../../ReadableText";
import { StreamlineIcon } from "../../StreamlineIcon";
import { firstLetterUpperCase } from "../../../libs";
import { styles } from "../../../theme";

const ThemeText = styled(TextSmallNormal)`
  color: white;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
  text-decoration-line: underline;
`;

const ThemeContainer = styled(RTLTouchableOpacity)`
  align-items: center;
`;

const IndicatorContainer = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.white};
  align-self: center;
  border-radius: 8px;
  height: 32px;
  align-self: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${({ theme }) => theme.colors.black};
`;

const IndicatorNumber = styled(TextVerySmallNormal)`
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin / 2)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin / 2 : 0)}px;
`;

export interface HeaderContentContentsScreenProps extends HeaderContentProps {
  themeDarkColor: string;
  themeName: string;
  icon: Picture;
  navigation: any;
  needName: string;
  nbContents: number;
  isLoading: boolean;
}

const stylesheet = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
  },
  headerText: {
    fontSize: styles.fonts.sizes.big,
    fontFamily: styles.fonts.families.circularBold,
    lineHeight: 32,
    color: styles.colors.white,
  },
});

export const HeaderContentContentsScreen = ({
  animatedController,
  nbContents,
  themeDarkColor,
  showSimplifiedHeader,
  themeName,
  navigation,
  icon,
  needName,
  isLoading,
}: HeaderContentContentsScreenProps) => {
  const { t, isRTL } = useTranslationWithRTL();
  const theme = useTheme();
  const indicatorText =
    nbContents < 2
      ? t("needs_screen.fiche", "fiche")
      : t("needs_screen.fiches", "fiches");

  const headerFontSize = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 16],
  });

  const tagHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  if (showSimplifiedHeader) {
    return <></>;
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: themeDarkColor,
        },
      ]}
    >
      <Animated.View
        style={{
          height: tagHeight,
        }}
      >
        {!showSimplifiedHeader && (
          <ThemeContainer
            onPress={navigation.goBack}
            accessibilityRole="button"
          >
            <ThemeText>
              <ReadableText overridePosY={0}>
                {firstLetterUpperCase(themeName)}
              </ReadableText>
            </ThemeText>
            {!showSimplifiedHeader && <StreamlineIcon icon={icon} size={16} />}
          </ThemeContainer>
        )}
      </Animated.View>
      <Animated.Text
        style={[
          stylesheet.headerText,
          {
            textAlign: isRTL ? "right" : "left",
            fontSize: headerFontSize,
          },
        ]}
      >
        <ReadableText overridePosY={10}>{needName}</ReadableText>
      </Animated.Text>
      {isLoading
        ? !showSimplifiedHeader && (
            <SkeletonContent
              containerStyle={{
                marginTop: theme.margin * 2,
                marginBottom: theme.margin * 4,
                alignSelf: isRTL ? "flex-end" : "flex-start",
              }}
              isLoading={true}
              layout={[
                {
                  key: "SectionHeader",
                  width: 62,
                  height: 32,
                },
              ]}
              boneColor={theme.colors.grey}
              highlightColor={theme.colors.lightGrey}
            />
          )
        : !showSimplifiedHeader && (
            <Animated.View
              style={{
                display: "flex",
                height: tagHeight,
                marginTop: theme.margin * 2,
                marginBottom: theme.margin * 4,
              }}
            >
              <IndicatorContainer>
                <IndicatorNumber>{nbContents}</IndicatorNumber>
                <IndicatorText>{indicatorText}</IndicatorText>
              </IndicatorContainer>
            </Animated.View>
          )}
    </Animated.View>
  );
};

export default HeaderContentContentsScreen;
