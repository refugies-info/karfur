import HTML from "react-native-render-html";
import * as React from "react";
import { View } from "react-native";
import { theme } from "../../theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { TextSmallNormal } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

interface Props {
  htmlContent: string;
  windowWidth: number;
}
export const ContentFromHtml = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <HTML
      contentWidth={props.windowWidth}
      source={{ html: props.htmlContent }}
      defaultTextProps={{ selectable: true }}
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
          alignItems: "center",
        },
        "icon-left-side": {
          height: 24,
          width: 24,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.black,
          marginRight: isRTL ? 0 : theme.margin * 2,
          marginLeft: isRTL ? theme.margin * 2 : 0,
          borderRadius: "50%",
          color: theme.colors.lightRed,
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
          fontWeight: null,
        },
        em: {
          fontFamily: theme.fonts.families.circularItalic,
        },
        b: {
          fontFamily: theme.fonts.families.circularBold,
          textAlign: isRTL ? "right" : "left",
          fontWeight: null,
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
        ul: (_, children, _cssStyles, passProps) => (
          <View
            key={passProps.key}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: theme.margin,
              marginTop: theme.margin,
            }}
          >
            {children}
          </View>
        ),
        // eslint-disable-next-line react/display-name
        li: (_, children, _cssStyles, passProps) => (
          <RTLView
            key={passProps.key}
            style={{
              marginBottom: theme.margin,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                marginLeft: isRTL ? theme.margin : 0,
                marginRight: isRTL ? 0 : theme.margin,
                marginTop: 3,
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
        p: (_, children, _cssStyles, passProps) => (
          <TextSmallNormal
            key={passProps.key}
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
