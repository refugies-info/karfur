import { Animated, StyleSheet } from "react-native";
import React from "react";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { TextSmallNormal, TextVerySmallNormal } from "../StyledText";
import styled from "styled-components/native";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { ReadableText } from "../ReadableText";

const ThemeText = styled(TextSmallNormal)`
  color: white;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  text-decoration-line: underline;
`;

const ThemeContainer = styled(RTLTouchableOpacity)`
  align-items: center;
`;

const IndicatorContainer = styled(RTLView)`
  background-color: ${styles.colors.white};
  padding: ${styles.margin}px;
  align-self: center;
  border-radius: 8px;
  height: 32px;
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${styles.colors.black};
`;

const IndicatorNumber = styled(TextVerySmallNormal)`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin / 2 : 0}px;
`;

interface Props {
  tagDarkColor: string;
  headerBottomRadius: any;
  headerPaddingTop: any;
  tagName: string;
  headerFontSize: any;
  iconName: string;
  showSimplifiedHeader: boolean;
  navigation: any;
  needName: string;
  nbContents: number;
  isLoading: boolean;
  tagHeight: any;
}

const stylesheet = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
    paddingHorizontal: styles.margin * 3,
  },
  headerText: {
    fontSize: styles.fonts.sizes.big,
    fontFamily: styles.fonts.families.circularBold,
    lineHeight: 32,
    color: styles.colors.white,
  },
});

export const ContentsHeaderAnimated = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const indicatorText =
    props.nbContents < 2
      ? t("needs_screen.fiche", "fiche")
      : t("needs_screen.fiches", "fiches");
  return (
    <Animated.View
      style={[
        stylesheet.bodyBackground,
        {
          backgroundColor: props.tagDarkColor,
          borderBottomRightRadius: props.headerBottomRadius,
          borderBottomLeftRadius: props.headerBottomRadius,
          paddingTop: props.headerPaddingTop,
        },
      ]}
    >
      <Animated.View
        style={{
          height: props.tagHeight,
        }}
      >
        {!props.showSimplifiedHeader && (
          <ThemeContainer
            onPress={props.navigation.goBack}
            accessibilityRole="button"
          >
            <ThemeText isRTL={isRTL}>
              <ReadableText overridePosY={0}>
                {firstLetterUpperCase(
                  t("tags." + props.tagName, props.tagName)
                ) || ""}
              </ReadableText>
            </ThemeText>
            {!props.showSimplifiedHeader && (
              <StreamlineIcon name={props.iconName} width={16} height={16} />
            )}
          </ThemeContainer>
        )}
      </Animated.View>
      {/* <Text
        style={[
          stylesheet.headerText,
          {
            textAlign: isRTL ? "right" : "left",
            marginRight: isRTL ? 0 : styles.margin,
            marginLeft: isRTL ? styles.margin : 0,
            fontSize: props.showSimplifiedHeader ? 16 : 25,
          },
        ]}
      >
        {props.needName}
      </Text> */}
      <Animated.Text
        style={[
          stylesheet.headerText,
          {
            textAlign: isRTL ? "right" : "left",
            marginRight: isRTL ? 0 : styles.margin,
            marginLeft: isRTL ? styles.margin : 0,
            fontSize: props.headerFontSize,
          },
        ]}
      >
        <ReadableText overridePosY={10}>
          {props.needName}
        </ReadableText>
      </Animated.Text>
      {props.isLoading
        ? !props.showSimplifiedHeader && (
            <SkeletonContent
              containerStyle={{
                marginTop: styles.margin * 2,
                marginBottom: styles.margin * 4,
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
              boneColor={styles.colors.grey}
              highlightColor={styles.colors.lightGrey}
            />
          )
        : !props.showSimplifiedHeader && (
            <Animated.View
              style={{
                display: "flex",
                height: props.tagHeight,
                marginTop: styles.margin * 2,
                marginBottom: styles.margin * 4,
              }}
            >
              <IndicatorContainer isRTL={isRTL}>
                <IndicatorNumber isRTL={isRTL}>
                  {props.nbContents}
                </IndicatorNumber>
                <IndicatorText>{indicatorText}</IndicatorText>
              </IndicatorContainer>
            </Animated.View>
          )}
    </Animated.View>
  );
};
