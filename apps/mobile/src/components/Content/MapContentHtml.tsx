import HTML from "react-native-render-html";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";

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
        fontSize: props.isLarge ? styles.fonts.sizes.l : styles.fonts.sizes.md,
        fontFamily: props.isBold ? styles.fonts.families.marianneBold : styles.fonts.families.marianneReg,
        textAlign: isRTL ? "right" : "left",
        lineHeight: props.isLarge ? 24 : 20,
        flexShrink: 1,
        color: props.darkColor,
      }}
    />
  );
};
