import HTML from "react-native-render-html";
import * as React from "react";
import { theme } from "../../theme";
import { TextSmallNormal } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
}
export const TextFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <HTML
      source={{ html: props.htmlContent }}
      defaultTextProps={{ selectable: true }}
      baseFontStyle={{
        fontSize: theme.fonts.sizes.small,
        fontFamily: theme.fonts.families.circularStandard,
        textAlign: isRTL ? "right" : "left",
        margin: 0,
      }}
      renderers={{
        // eslint-disable-next-line react/display-name
        p: (_, children) => (
          <TextSmallNormal
            style={{
              flexShrink: 1,
              marginBottom: 0,
              padding: 0,
            }}
          >
            {children}
          </TextSmallNormal>
        ),
      }}
    />
  );
};
