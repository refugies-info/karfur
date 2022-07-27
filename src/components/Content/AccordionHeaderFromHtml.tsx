import HTML from "react-native-render-html";
import * as React from "react";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";

interface Props {
  htmlContent: string;
  width: number;
  windowWidth: number;
  darkColor: string;
}
export const AccordionHeaderFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <ReadableText text={props.htmlContent.replace(/<[^>]*>?/gm, "")}>
      <HTML
        contentWidth={props.windowWidth}
        source={{ html: props.htmlContent }}
        baseFontStyle={{
          fontSize: theme.fonts.sizes.small,
          fontFamily: theme.fonts.families.circularBold,
          textAlign: isRTL ? "right" : "left",
          lineHeight: 20,
          flexShrink: 1,
          width: props.width,
          color: props.darkColor,
        }}
        renderers={{
          // eslint-disable-next-line react/display-name
          p: (_, children, _cssStyles, passProps) => (
            <TextSmallBold
              key={passProps.key}
              style={{
                flexShrink: 1,
                width: props.width,
                color: props.darkColor,
              }}
            >
              {children}
            </TextSmallBold>
          ),
        }}
      />
    </ReadableText>
  );
};
