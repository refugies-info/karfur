import { Animated, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { RTLView, RTLTouchableOpacity } from "../BasicComponents";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import {
  TextNormal,
  TextSmallNormal,
  TextVerySmallNormal,
} from "../StyledText";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
  margin-bottom: ${theme.margin * 2}px;
  align-items: center;
`;

const IndicatorContainer = styled.View`
  background-color: ${theme.colors.white};
  padding: ${theme.margin}px;
  align-self: center;
  border-radius: 8px;
  height: 32px;
margin-top:${theme.margin * 2}px
  align-self: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "flex-end" : "flex-start"};
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${theme.colors.black};
`;

interface Props {
  tagDarkColor: string;
  headerBottomRadius: any;
  headerHeight: any;
  headerPaddingTop: any;
  tagName: string;
  headerFontSize: any;
  iconName: string;
  showSimplifiedHeader: boolean;
  navigation: any;
  needName: string;
  nbContents: number;
  isLoading: boolean;
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
      ? props.nbContents + " " + t("NeedsScreen.fiche", "fiche")
      : props.nbContents + " " + t("NeedsScreen.fiches", "fiches");
  return (
    <Animated.View
      style={[
        styles.bodyBackground,
        {
          height: props.headerHeight,
          backgroundColor: props.tagDarkColor,
          borderBottomRightRadius: props.headerBottomRadius,
          borderBottomLeftRadius: props.headerBottomRadius,
          paddingTop: props.headerPaddingTop,
        },
      ]}
    >
      <ThemeContainer onPress={props.navigation.goBack}>
        <ThemeText isRTL={isRTL}>
          {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName)) ||
            ""}
        </ThemeText>
        <StreamlineIcon name={props.iconName} width={16} height={16} />
      </ThemeContainer>
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
      {props.isLoading || false ? (
        <SkeletonContent
          containerStyle={{
            display: "flex",
            flex: 1,
            marginTop: theme.margin * 3,
            marginHorizontal: theme.margin * 3,
          }}
          isLoading={true}
          layout={[
            {
              key: "SectionHeader",
              width: 32,
              height: 32,
            },
          ]}
          boneColor={theme.colors.grey}
          highlightColor={theme.colors.lightGrey}
        />
      ) : (
        <IndicatorContainer isRTL={isRTL}>
          <IndicatorText>{indicatorText}</IndicatorText>
        </IndicatorContainer>
      )}
      {/* <IndicatorContainer isRTL={isRTL}>
        <IndicatorText>{indicatorText}</IndicatorText>
      </IndicatorContainer> */}
    </Animated.View>
  );
};
