import HTML from "react-native-render-html";
import * as React from "react";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
  darkColor: string;
  isLarge?: boolean;
  isBold: boolean;
}
export const MapContentFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <HTML
      source={{ html: props.htmlContent }}
      baseFontStyle={{
        fontSize: props.isLarge ? theme.fonts.sizes.normal : theme.fonts.sizes.small,
        fontFamily: props.isBold
          ? theme.fonts.families.circularBold
          : theme.fonts.families.circularStandard,
        textAlign: isRTL ? "right" : "left",
        lineHeight: props.isLarge ? 24 : 20,
        flexShrink: 1,
        color: props.darkColor,
      }}
    />
  );
};
