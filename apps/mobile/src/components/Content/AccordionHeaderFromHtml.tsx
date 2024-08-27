import { sanitize } from "dompurify";
import HTML from "react-native-render-html";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { ReadableText } from "../ReadableText";
import { TextDSFR_MD_Bold } from "../StyledText";

interface Props {
  htmlContent: string;
  width: number;
  windowWidth: number;
  darkColor: string;
}
export const AccordionHeaderFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <ReadableText text={sanitize(props.htmlContent)}>
      <HTML
        contentWidth={props.windowWidth}
        source={{ html: props.htmlContent }}
        baseFontStyle={{
          fontSize: styles.fonts.sizes.md,
          fontFamily: styles.fonts.families.marianneBold,
          textAlign: isRTL ? "right" : "left",
          lineHeight: 20,
          flexShrink: 1,
          width: props.width,
          color: props.darkColor,
        }}
        renderers={{
          // eslint-disable-next-line react/display-name
          p: (_, children, _cssStyles, passProps) => (
            <TextDSFR_MD_Bold
              key={passProps.key}
              style={{
                flexShrink: 1,
                width: props.width,
                color: props.darkColor,
              }}
            >
              {children}
            </TextDSFR_MD_Bold>
          ),
        }}
      />
    </ReadableText>
  );
};
