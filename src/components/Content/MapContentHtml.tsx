import HTML from "react-native-render-html";
import * as React from "react";
import { theme } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
  darkColor: string;
  isBold: boolean;
}
export const MapContentFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <HTML
      source={{ html: props.htmlContent }}
      baseFontStyle={{
        fontSize: theme.fonts.sizes.normal,
        fontFamily: props.isBold
          ? theme.fonts.families.circularBold
          : theme.fonts.families.circularStandard,
        textAlign: isRTL ? "right" : "left",
        lineHeight: 24,
        flexShrink: 1,
        color: props.darkColor,
      }}
    />
  );
};
