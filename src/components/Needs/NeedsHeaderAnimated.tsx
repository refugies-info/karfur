import { Animated, StyleSheet } from "react-native";
import React from "react";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { RTLView } from "../BasicComponents";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { ReadableText } from "../ReadableText";

interface Props {
  tagDarkColor: string;
  headerBottomRadius: any;
  headerHeight: any;
  headerPaddingTop: any;
  tagName: string;
  headerFontSize: any;
  iconName: string;
  showSimplifiedHeader: boolean;
}

const stylesheet = StyleSheet.create({
  bodyBackground: {
    overflow: "hidden",
    paddingHorizontal: styles.margin * 3,
  },

  bodyContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  headerText: {
    fontSize: styles.fonts.sizes.big,
    fontFamily: styles.fonts.families.circularBold,
    lineHeight: 32,
    color: styles.colors.white,
  },
});

export const NeedsHeaderAnimated = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  return (
    <Animated.View
      style={[
        stylesheet.bodyBackground,
        {
          height: props.headerHeight,
          backgroundColor: props.tagDarkColor,
          borderBottomRightRadius: props.headerBottomRadius,
          borderBottomLeftRadius: props.headerBottomRadius,
          paddingTop: props.headerPaddingTop,
        },
      ]}
    >
      <RTLView>
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
          <ReadableText overridePosY={0}>
            {firstLetterUpperCase(t("tags." + props.tagName, props.tagName)) || ""}
          </ReadableText>
        </Animated.Text>

        <StreamlineIcon
          name={props.iconName}
          width={props.showSimplifiedHeader ? 16 : 24}
          height={props.showSimplifiedHeader ? 16 : 24}
        />
      </RTLView>
    </Animated.View>
  );
};
