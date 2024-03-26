import HTML from "react-native-render-html";
import * as React from "react";
import { Text, View } from "react-native";
import { styles } from "../../theme";
import { RTLView } from "../BasicComponents";
import { TextNormal, TextNormalBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";
import { Card, Columns, Rows, RowsSpacing, Spacer } from "../layout";
import { useTheme } from "styled-components/native";
import { Icon } from "../iconography";

interface Props {
  htmlContent: string;
  windowWidth: number;
  fromAccordion?: boolean;
}
export const ContentFromHtml = React.forwardRef((props: Props, ref: any) => {
  const theme = useTheme();
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <View style={{ flexDirection: "row" }}>
      <ReadableText
        ref={ref}
        text={props.htmlContent
          .replaceAll("</p>", "</p> ") // wait before starting to read new sentence
          .replaceAll(/<[^>]*>?/gm, "")}
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
                <TextNormal style={{ flexShrink: 1 }}>{children}</TextNormal>
              </RTLView>
            ),
            p: (_, children, _cssStyles, passProps) => (
              <TextNormal
                key={passProps.key}
                style={{
                  marginBottom: styles.margin,
                  flexShrink: 1,
                }}
              >
                {children}
              </TextNormal>
            ),
            div: (_, children, _cssStyles, passProps) => {
              if (_["data-callout"] === "important") {
                return (
                  <View key={passProps.key}>
                    <Spacer
                      key={passProps.key + "_spacer"}
                      height={theme.margin * 3}
                    />
                    <Card
                      key={passProps.key}
                      backgroundColor={theme.colors.lightGrey}
                    >
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
                            <TextNormalBold>
                              {t(
                                "content_screen.callout_important",
                                "Important"
                              )}
                            </TextNormalBold>
                            {children}
                          </Rows>
                        </View>
                      </Columns>
                    </Card>
                    <Spacer
                      key={passProps.key + "_spacer_"}
                      height={theme.margin * 3}
                    />
                  </View>
                );
              }

              if (_["data-callout"] === "info") {
                return (
                  <View key={passProps.key}>
                    <Spacer
                      key={passProps.key + "_spacer"}
                      height={theme.margin * 3}
                    />
                    <Card
                      key={passProps.key}
                      backgroundColor={theme.colors.white}
                    >
                      <Columns layout="auto 1">
                        <View
                          style={{
                            marginHorizontal: theme.margin,
                            borderRadius: 2,
                            backgroundColor: "#6A6AF4",
                            flexGrow: 1,
                          }}
                        >
                          <View
                            style={{
                              width: theme.margin / 2,
                              alignSelf: "center",
                              backgroundColor: "#6A6AF4",
                            }}
                          />
                        </View>
                        <View style={{ padding: 10 }}>
                          <Rows spacing={RowsSpacing.Text}>
                            <TextNormalBold style={{ color: "#6A6AF4" }}>
                              {t("content_screen.callout_info", "Bon à savoir")}
                            </TextNormalBold>
                            {children}
                          </Rows>
                        </View>
                      </Columns>
                    </Card>
                    <Spacer
                      key={passProps.key + "_spacer_"}
                      height={theme.margin * 3}
                    />
                  </View>
                );
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
