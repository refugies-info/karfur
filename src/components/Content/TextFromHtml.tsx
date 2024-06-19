import HTML from "react-native-render-html";
import * as React from "react";
import { styles } from "../../theme";
import { TextDSFR_MD } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";

interface Props {
  htmlContent: string;
}
export const TextFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <>
      <ReadableText text={props.htmlContent.replace(/<[^>]*>?/gm, "")}>
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
            // eslint-disable-next-line react/display-name
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
      </ReadableText>
    </>
  );
};
