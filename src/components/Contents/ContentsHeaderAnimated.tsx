import { Animated, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { TextSmallNormal, TextVerySmallNormal } from "../StyledText";
import styled from "styled-components/native";
import SkeletonContent from "react-native-skeleton-content";

const ThemeText = styled(TextSmallNormal)`
  color: white;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  text-decoration-line: underline;
`;

const ThemeContainer = styled(RTLTouchableOpacity)`
  align-items: center;
`;

const IndicatorContainer = styled(RTLView)`
  background-color: ${theme.colors.white};
  padding: ${theme.margin}px;
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
  color: ${theme.colors.black};
`;

const IndicatorNumber = styled(TextVerySmallNormal)`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin / 2 : 0}px;
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

const styles = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
    paddingHorizontal: theme.margin * 3,
  },

  bodyContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  headerText: {
    fontSize: theme.fonts.sizes.big,
    fontFamily: theme.fonts.families.circularBold,
    lineHeight: 32,
    color: theme.colors.white,
  },
});

export const ContentsHeaderAnimated = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const indicatorText =
    props.nbContents < 2
      ? t("NeedsScreen.fiche", "fiche")
      : t("NeedsScreen.fiches", "fiches");
  return (
    <Animated.View
      style={[
        styles.bodyBackground,
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
          <ThemeContainer onPress={props.navigation.goBack}>
            <ThemeText isRTL={isRTL}>
              {firstLetterUpperCase(
                t("Tags." + props.tagName, props.tagName)
              ) || ""}
            </ThemeText>
            {!props.showSimplifiedHeader && (
              <StreamlineIcon name={props.iconName} width={16} height={16} />
            )}
          </ThemeContainer>
        )}
      </Animated.View>
      {/* <Text
        style={[
          styles.headerText,
          {
            textAlign: isRTL ? "right" : "left",
            marginRight: isRTL ? 0 : theme.margin,
            marginLeft: isRTL ? theme.margin : 0,
            fontSize: props.showSimplifiedHeader ? 16 : 25,
          },
        ]}
      >
        {props.needName}
      </Text> */}
      <Animated.Text
        style={[
          styles.headerText,
          {
            textAlign: isRTL ? "right" : "left",
            marginRight: isRTL ? 0 : theme.margin,
            marginLeft: isRTL ? theme.margin : 0,
            fontSize: props.headerFontSize,
          },
        ]}
      >
        {props.needName}
      </Animated.Text>
      {props.isLoading
        ? !props.showSimplifiedHeader && (
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
        : !props.showSimplifiedHeader && (
            <Animated.View
              style={{
                display: "flex",
                height: props.tagHeight,
                marginTop: theme.margin * 2,
                marginBottom: theme.margin * 4,
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
