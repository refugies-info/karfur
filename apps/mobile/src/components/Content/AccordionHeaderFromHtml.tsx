import HTML, { CustomRendererProps, TBlock, TChildrenRenderer, useRendererProps } from "react-native-render-html";
import sanitizeHtml from "sanitize-html";
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
    <ReadableText
      text={sanitizeHtml(props.htmlContent, {
        allowedTags: [],
        allowedAttributes: {},
      })}
    >
      <HTML
        contentWidth={props.windowWidth}
        source={{ html: props.htmlContent }}
        baseStyle={{
          fontSize: styles.fonts.sizes.md,
          fontFamily: styles.fonts.families.marianneBold,
          textAlign: isRTL ? "right" : "left",
          lineHeight: 20,
          flexShrink: 1,
          width: props.width,
          color: props.darkColor,
        }}
        renderers={{
          p: ({ tnode }: CustomRendererProps<TBlock>) => {
            const props = useRendererProps("p");

            return (
              <TextDSFR_MD_Bold
                style={{
                  flexShrink: 1,
                  width: props.width,
                  color: props.darkColor,
                }}
              >
                <TChildrenRenderer tchildren={tnode.children} />
              </TextDSFR_MD_Bold>
            );
          },
        }}
      />
    </ReadableText>
  );
};
