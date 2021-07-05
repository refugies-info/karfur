import HTML from "react-native-render-html";
import * as React from "react";
import { useWindowDimensions, View } from "react-native";
import { theme } from "../../theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { TextSmallNormal } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
}
export const ContentFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const contentWidth = useWindowDimensions().width;

  return (
    <HTML
      contentWidth={contentWidth}
      source={{ html: props.htmlContent }}
      classesStyles={{
        "bloc-rouge": {
          backgroundColor: theme.colors.lightRed,
          borderRadius: theme.radius * 2,
          padding: theme.margin * 2,
          display: "flex",
          marginBottom: theme.margin,
          flexDirection: isRTL ? "row-reverse" : "row",
          textAlign: isRTL ? "right" : "left",
          marginTop: theme.margin,
        },
        "icon-left-side": {
          paddingRight: isRTL ? 0 : theme.margin * 2,
          paddingLeft: isRTL ? theme.margin * 2 : 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        "right-side": {
          color: theme.colors.black,
          textAlign: isRTL ? "right" : "left",
          flexShrink: 1,
        },
      }}
      tagsStyles={{
        strong: {
          fontFamily: theme.fonts.families.circularBold,
        },
        b: {
          fontFamily: theme.fonts.families.circularBold,
          textAlign: isRTL ? "right" : "left",
        },
      }}
      baseFontStyle={{
        fontSize: theme.fonts.sizes.small,
        fontFamily: theme.fonts.families.circularStandard,
        textAlign: isRTL ? "right" : "left",
        lineHeight: 20,
      }}
      renderers={{
        // eslint-disable-next-line react/display-name
        ul: (_, children) => (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </View>
        ),
        // eslint-disable-next-line react/display-name
        li: (_, children) => (
          <RTLView style={{ marginBottom: theme.margin }}>
            <View
              style={{
                marginLeft: isRTL ? theme.margin : 0,
                marginRight: isRTL ? 0 : theme.margin,
              }}
            >
              <Icon
                name={isRTL ? "arrow-left" : "arrow-right"}
                height={18}
                width={18}
                fill={theme.colors.black}
              />
            </View>
            <TextSmallNormal style={{ flexShrink: 1 }}>
              {children}
            </TextSmallNormal>
          </RTLView>
        ),
        // eslint-disable-next-line react/display-name
        p: (_, children) => (
          <TextSmallNormal
            style={{
              marginBottom: theme.margin,
              marginTop: theme.margin,
              flexShrink: 1,
            }}
          >
            {children}
          </TextSmallNormal>
        ),
      }}
    />
  );
};
