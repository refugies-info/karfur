import HTML, { CustomRendererProps, TBlock, TChildrenRenderer } from "react-native-render-html";
import sanitizeHtml from "sanitize-html";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { ReadableText } from "../ReadableText";
import { TextDSFR_MD } from "../StyledText";

interface Props {
  htmlContent: string;
}

export const TextFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <>
      <ReadableText
        text={sanitizeHtml(props.htmlContent, {
          allowedTags: [],
          allowedAttributes: {},
        })}
      >
        <HTML
          source={{ html: props.htmlContent }}
          defaultTextProps={{ selectable: true }}
          baseStyle={{
            fontSize: styles.fonts.sizes.md,
            fontFamily: styles.fonts.families.marianneReg,
            textAlign: isRTL ? "right" : "left",
            margin: 0,
          }}
          renderers={{
            p: ({ tnode }: CustomRendererProps<TBlock>) => (
              <TextDSFR_MD
                style={{
                  flexShrink: 1,
                  marginBottom: 0,
                  padding: 0,
                }}
              >
                <TChildrenRenderer tchildren={tnode.children} />
              </TextDSFR_MD>
            ),
          }}
        />
      </ReadableText>
    </>
  );
};
