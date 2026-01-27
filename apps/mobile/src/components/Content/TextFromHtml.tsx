import HTML from "react-native-render-html";
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

  // @ts-expect-error
  const sanitize =
    typeof sanitizeHtml === "function" ? sanitizeHtml : (sanitizeHtml as any).default;
  return (
    <>
      <ReadableText
        text={sanitize(props.htmlContent, {
          allowedTags: [],
          allowedAttributes: {},
        })}
      >
        {!!props.htmlContent && (
          <HTML
            source={{ html: props.htmlContent }}
            defaultTextProps={{ selectable: true }}
            baseFontStyle={{
              fontSize: styles.fonts.sizes.md,
              fontFamily: styles.fonts.families.marianneReg,
              textAlign: isRTL ? "right" : "left",
              margin: 0,
            }}
            renderers={{
              p: (_, children, _cssStyles, passProps) => (
                <TextDSFR_MD
                  key={passProps.key}
                  style={{
                    flexShrink: 1,
                    marginBottom: 0,
                    padding: 0,
                  }}
                >
                  {children}
                </TextDSFR_MD>
              ),
            }}
          />
        )}
      </ReadableText>
    </>
  );
};
