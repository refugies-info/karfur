import HTML from "react-native-render-html";
import * as React from "react";
import { styles } from "../../theme";
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
      defaultTextProps={{ selectable: true }}
      baseFontStyle={{
        fontSize: props.isLarge
          ? styles.fonts.sizes.normal
          : styles.fonts.sizes.small,
        fontFamily: props.isBold
          ? styles.fonts.families.circularBold
          : styles.fonts.families.circularStandard,
        textAlign: isRTL ? "right" : "left",
        lineHeight: props.isLarge ? 24 : 20,
        flexShrink: 1,
        color: props.darkColor,
      }}
    />
  );
};
