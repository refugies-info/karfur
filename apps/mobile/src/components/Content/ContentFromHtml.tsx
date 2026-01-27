import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as React from "react";
import { useMemo } from "react";
import { Text as RNText, View } from "react-native";
import HTML from "react-native-render-html";
import { useSelector } from "react-redux";
import sanitizeHtml from "sanitize-html";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getScreenFromUrl } from "~/libs/getScreenFromUrl";
import { styles } from "~/theme";
import { RTLView } from "../BasicComponents";
import { Link } from "../Profil/Typography";
import { ReadableText, type ReadableTextRef } from "../ReadableText";
import { TextDSFR_MD } from "../StyledText";
import { Callout } from "../typography";
import { RIAccordion } from "./RIAccordion";

interface Props {
  htmlContent: string;
  windowWidth: number;
  fromAccordion?: boolean;
  darkColor?: string;
  lightColor?: string;
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

const ContentFromHtml = React.forwardRef<ReadableTextRef, Props>((props, ref) => {
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
    if (screen) {
      // biome-ignore lint/suspicious/noExplicitAny: Dynamic navigation dispatch
      (navigation as any).navigate(screen.rootNavigator, screen.screenParams);
    }
  };

  /**
   * Styles for specific HTML tags.
   * Maps standard HTML elements (h1, h2, strong, etc.) to React Native styles
   * to ensure visual consistency with the design system (DSFR).
   */
  const tagsStyles = useMemo(
    () => ({
      strong: {
        fontFamily: styles.fonts.families.marianneBold,
        fontWeight: undefined, // Fix for RN fontWeight type
      },
      em: {
        fontFamily: styles.fonts.families.marianneRegItalic,
      },
      b: {
        fontFamily: styles.fonts.families.marianneBold,
        textAlign: isRTL ? "right" : "left",
        fontWeight: undefined, // Fix for RN fontWeight type
      },
      h1: {
        fontFamily: styles.fonts.families.marianneBold,
        fontSize: styles.fonts.sizes.xl,
        lineHeight: 32,
        color: props.darkColor,
        marginBottom: theme.margin * 3,
      },
      h2: {
        fontFamily: styles.fonts.families.marianneBold,
        fontSize: styles.fonts.sizes.l,
        lineHeight: 28,
        color: props.darkColor,
        marginBottom: theme.margin * 2,
      },
      h3: {
        fontFamily: styles.fonts.families.marianneBold,
        fontSize: styles.fonts.sizes.md,
        lineHeight: 24,
        color: props.darkColor,
        marginBottom: theme.margin,
      },
    }),
    [isRTL, props.darkColor, theme.margin],
  );

  /**
   * Custom renderers for complex HTML structures or custom directives.
   * Handles:
   * - `a`: External links handling
   * - `ul`/`li`: Custom list styling with RTL support
   * - `div`: Special directives parsing (:::important, :::info, :::toggle) via data-attributes
   */
  const renderers = useMemo(
    () => ({
      a: (attrs: any, children: any, _cssStyles: any, passProps: any) => (
        <Link
          accessibilityRole="link"
          onPress={() => handleOpenUrl(attrs.href.toString())}
          key={passProps.key}
        >
          {children}
        </Link>
      ),
      ul: (_: any, children: any, _cssStyles: any, passProps: any) => (
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
      li: (_: any, children: any, _cssStyles: any, passProps: any) => (
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
            <RNText style={{ fontSize: 10 }}>{"\u25CF"}</RNText>
          </View>
          <TextDSFR_MD style={{ flexShrink: 1 }}>{children}</TextDSFR_MD>
        </RTLView>
      ),
      p: (_: any, children: any, _cssStyles: any, passProps: any) => (
        <TextDSFR_MD key={passProps.key} style={{ marginBottom: styles.margin, flexShrink: 1 }}>
          {children}
        </TextDSFR_MD>
      ),
      div: (_: any, children: any, _cssStyles: any, passProps: any) => {
        const calloutType = _["data-callout"];
        const componentType = _["data-component"];

        // DIRECTIVE: :::important
        if (calloutType === "important") {
          return (
            <Callout key={passProps.key} variant="important">
              {children}
            </Callout>
          );
        }

        // DIRECTIVE: :::good-to-know (info)
        if (calloutType === "info") {
          return <Callout key={passProps.key}>{children}</Callout>;
        }

        // DIRECTIVE: :::toggle
        if (componentType === "toggle") {
          const title = _["data-title"];
          const stepNumber = _["data-step-number"]
            ? Number.parseInt(String(_["data-step-number"]), 10)
            : null;

          return (
            <RIAccordion key={passProps.key} title={String(title || "")} stepNumber={stepNumber}>
              {children}
            </RIAccordion>
          );
        }

        return <View key={passProps.key}>{children}</View>;
      },
    }),
    [
      isRTL,
      props.darkColor,
      props.lightColor,
      props.windowWidth,
      t,
      theme.colors.black,
      theme.colors.lightGrey,
      theme.colors.white,
      theme.margin,
    ],
  );

  /**
   * Styles for specific CSS classes found in the HTML.
   * These classes might come from the CMS or legacy content editing tools.
   * Examples: `bloc-rouge` (used for older alert boxes), `icon-left-side`.
   */
  const classesStyles = useMemo(
    () => ({
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
        // biome-ignore lint/suspicious/noExplicitAny: width string is valid here but strict types complain
        width: "100%" as any,
      },
    }),
    [isRTL],
  );

  return (
    <View style={{ flexDirection: "column" }}>
      <ReadableText
        ref={ref}
        text={sanitizeForReading(props.htmlContent || "")}
        heightOffset={props.fromAccordion}
      >
        {!!props.htmlContent && (
          <HTML
            contentWidth={props.windowWidth}
            source={{ html: props.htmlContent }}
            defaultTextProps={{ selectable: true }}
            classesStyles={classesStyles}
            tagsStyles={tagsStyles}
            baseFontStyle={{
              fontSize: styles.fonts.sizes.md,
              fontFamily: styles.fonts.families.marianneReg,
              textAlign: isRTL ? "right" : "left",
              lineHeight: 20,
            }}
            renderers={renderers}
          />
        )}
      </ReadableText>
    </View>
  );
});

ContentFromHtml.displayName = "ContentFromHtml";

export { ContentFromHtml };
