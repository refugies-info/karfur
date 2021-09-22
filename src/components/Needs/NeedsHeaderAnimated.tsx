import { Animated, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { RTLView } from "../BasicComponents";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";

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

export const NeedsHeaderAnimated = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
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
      <RTLView>
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
          {firstLetterUpperCase(t("Tags." + props.tagName, props.tagName)) ||
            ""}
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
