import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as React from "react";
import { Text, View } from "react-native";
import HTML from "react-native-render-html";
import sanitizeHtml from "sanitize-html";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getScreenFromUrl } from "~/libs/getScreenFromUrl";
import { styles } from "~/theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "../iconography";
import { Card, Columns, Rows, RowsSpacing, Spacer } from "../layout";
import { Link } from "../Profil/Typography";
import { ReadableText } from "../ReadableText";
import { TextDSFR_MD, TextDSFR_MD_Bold } from "../StyledText";
import { Callout } from "../typography";

interface Props {
  htmlContent: string;
  windowWidth: number;
  fromAccordion?: boolean;
}

const sanitizeForReading = (htmlContent: string) => {
  const htmlForReading = htmlContent
    .replaceAll("</p>", "</p> ") // wait before starting to read new sentence
    .replaceAll("</ul>", ".</ul> ") // wait after reading list
    .replaceAll(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gm, ""); // remove html character entities
  return sanitizeHtml(htmlForReading, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

export const ContentFromHtml = React.forwardRef((props: Props, ref: any) => {
  const theme = useTheme();
  const { t, isRTL } = useTranslationWithRTL();

  const navigation = useNavigation();
  /**
   * Opens url in app if possible
   * @param url
   */
  const handleOpenUrl = (url: string) => {
    if (!url.includes("refugies.info")) Linking.openURL(url);
    const screen = getScreenFromUrl(url);
    //@ts-ignore
    if (screen) navigation.navigate(screen.rootNavigator, screen.screenParams);
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <ReadableText ref={ref} text={sanitizeForReading(props.htmlContent)} heightOffset={props.fromAccordion}>
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
              fontFamily: styles.fonts.families.marianneBold,
              fontWeight: null,
            },
            em: {
              fontFamily: styles.fonts.families.marianneRegItalic,
            },
            b: {
              fontFamily: styles.fonts.families.marianneBold,
              textAlign: isRTL ? "right" : "left",
              fontWeight: null,
            },
          }}
          baseFontStyle={{
            fontSize: styles.fonts.sizes.md,
            fontFamily: styles.fonts.families.marianneReg,
            textAlign: isRTL ? "right" : "left",
            lineHeight: 20,
          }}
          renderers={{
            a: (attrs, children, _cssStyles, passProps) => (
              <Link accessibilityRole="link" onPress={() => handleOpenUrl(attrs.href.toString())} key={passProps.key}>
                {children}
              </Link>
            ),
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
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>{"\u25CF"}</Text>
                </View>
                <TextDSFR_MD style={{ flexShrink: 1 }}>{children}</TextDSFR_MD>
              </RTLView>
            ),
            p: (_, children, _cssStyles, passProps) => (
              <TextDSFR_MD
                key={passProps.key}
                style={{
                  marginBottom: styles.margin,
                  flexShrink: 1,
                }}
              >
                {children}
              </TextDSFR_MD>
            ),
            div: (_, children, _cssStyles, passProps) => {
              if (_["data-callout"] === "important") {
                return (
                  <View key={passProps.key}>
                    <Spacer key={passProps.key + "_spacer"} height={theme.margin * 3} />
                    <Card key={passProps.key} backgroundColor={theme.colors.lightGrey}>
                      <Columns layout="auto 1">
                        <View
                          style={{
                            backgroundColor: "#6A6AF4",
                            flexGrow: 1,
                          }}
                        >
                          <Icon name="warning" size={40} color="white" />
                        </View>
                        <View style={{ padding: 10 }}>
                          <Rows spacing={RowsSpacing.Text}>
                            <TextDSFR_MD_Bold>{t("content_screen.callout_important", "Important")}</TextDSFR_MD_Bold>
                            {children}
                          </Rows>
                        </View>
                      </Columns>
                    </Card>
                    <Spacer key={passProps.key + "_spacer_"} height={theme.margin * 3} />
                  </View>
                );
              }

              if (_["data-callout"] === "info") {
                return <Callout key={passProps.key}>{children}</Callout>;
              }

              return <View key={passProps.key}>{children}</View>;
            },
          }}
        />
      </ReadableText>
    </View>
  );
});

ContentFromHtml.displayName = "ContentFromHtml";

/**
 * <div class='callout callout--important' data-callout='important'>Le Café des Réfugiés est seulement ouvert aux réfugiés statutaires et aux bénéficiaires de la protection subsidiaire domiciliés sur Paris (75000).  </div>
 * <div class='callout callout--important' data-callout='important'>Avant de participer, il faut aller au bureau du centre d'accueil pour faire le point sur votre situation.  </div>
 */
