import HTML from "react-native-render-html";
import * as React from "react";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
  width: number;
  windowWidth: number;
}
export const AccordionHeaderFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <HTML
      contentWidth={props.windowWidth}
      source={{ html: props.htmlContent }}
      baseFontStyle={{
        fontSize: theme.fonts.sizes.small,
        fontFamily: theme.fonts.families.circularBold,
        textAlign: isRTL ? "right" : "left",
        lineHeight: 20,
        flexShrink: 1,
        backgroundColor: "red",
      }}
      renderers={{
        // eslint-disable-next-line react/display-name
        p: (_, children) => (
          <TextSmallBold
            style={{
              flexShrink: 1,
              width: props.width,
            }}
          >
            {children}
          </TextSmallBold>
        ),
      }}
    />
  );
};
