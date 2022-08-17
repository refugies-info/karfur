import HTML from "react-native-render-html";
import * as React from "react";
import { View } from "react-native";
import { styles } from "../../theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { TextSmallNormal } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";

interface Props {
  htmlContent: string;
  windowWidth: number;
  fromAccordion?: boolean;
}
export const ContentFromHtml = React.forwardRef((props: Props, ref: any) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <View style={{ flexDirection: "row" }}>
      <ReadableText
        ref={ref}
        text={props.htmlContent.replace(/<[^>]*>?/gm, "")}
        heightOffset={props.fromAccordion}
      >
        <HTML
          contentWidth={props.windowWidth}
          source={{ html: props.htmlContent }}
          defaultTextProps={{ selectable: true }}
          classesStyles={{
            "bloc-rouge": {
              backgroundColor: styles.colors.lightRed,
              borderRadius: styles.radius * 2,
              padding: styles.margin * 2,
              display: "flex",
              marginBottom: styles.margin,
              flexDirection: isRTL ? "row-reverse" : "row",
              textAlign: isRTL ? "right" : "left",
              marginTop: styles.margin,
              alignItems: "center",
            },
            "icon-left-side": {
              height: 24,
              width: 24,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: styles.colors.black,
              marginRight: isRTL ? 0 : styles.margin * 2,
              marginLeft: isRTL ? styles.margin * 2 : 0,
              borderRadius: "50%",
              color: styles.colors.lightRed,
            },
            "right-side": {
              color: styles.colors.black,
              textAlign: isRTL ? "right" : "left",
              flexShrink: 1,
            },
          }}
          tagsStyles={{
            strong: {
              fontFamily: styles.fonts.families.circularBold,
              fontWeight: null,
            },
            em: {
              fontFamily: styles.fonts.families.circularItalic,
            },
            b: {
              fontFamily: styles.fonts.families.circularBold,
              textAlign: isRTL ? "right" : "left",
              fontWeight: null,
            },
          }}
          baseFontStyle={{
            fontSize: styles.fonts.sizes.small,
            fontFamily: styles.fonts.families.circularStandard,
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
                  marginBottom: styles.margin,
                  marginTop: styles.margin,
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
                  marginBottom: styles.margin,
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    marginLeft: isRTL ? styles.margin : 0,
                    marginRight: isRTL ? 0 : styles.margin,
                    marginTop: 3,
                  }}
                >
                  <Icon
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    height={18}
                    width={18}
                    fill={styles.colors.black}
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
                  marginBottom: styles.margin,
                  marginTop: styles.margin,
                  flexShrink: 1,
                }}
              >
                {children}
              </TextSmallNormal>
            ),
          }}
        />
      </ReadableText>
    </View>
  )
});

ContentFromHtml.displayName = "ContentFromHtml";