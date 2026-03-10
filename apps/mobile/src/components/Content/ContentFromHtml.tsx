/**
 * ContentFromHtml — Renders an HTML string as native React Native components.
 *
 * This is the central rendering bridge between HTML content (from the server or
 * the markdown pipeline) and native mobile components. It is used in two contexts:
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                          RENDERING CONTEXTS                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  1. RI (structured content)                                                 │
 * │     Section.tsx "what" ──► ContentFromHtml (single HTML block)               │
 * │     AccordionAnimated ──► ContentFromHtml (accordion body, fromAccordion)    │
 * │                                                                             │
 * │  2. RCO (markdown content, split into blocks by markdownToHtmlBlocks)       │
 * │     Section.tsx ──► ContentFromHtml[] (one per block: heading, callout...)   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                     INTERNAL RENDERING PIPELINE                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  htmlContent (string)                                                       │
 * │       │                                                                     │
 * │       ▼                                                                     │
 * │  ┌──────────────────────────────────────┐                                   │
 * │  │ react-native-render-html (<HTML />)  │  Parses HTML tags and dispatches   │
 * │  │                                      │  to custom renderers:              │
 * │  │  h2, h3 ──► TextDSFR_XL / L_Bold    │  Styled headings with theme color  │
 * │  │  p      ──► TextDSFR_MD             │  Styled paragraphs                 │
 * │  │  a      ──► Link                    │  In-app navigation or external URL  │
 * │  │  ul/li  ──► RTLView + bullet        │  RTL-aware list items               │
 * │  │  div    ──► (see below)             │  Dispatched by data-* attributes    │
 * │  └──────────────────────────────────────┘                                   │
 * │                                                                             │
 * │  div renderer (data-attribute dispatch):                                    │
 * │  ┌──────────────────────────────────────────────────────────────────┐       │
 * │  │ data-toggle="true"        ──► AccordionAnimated                 │       │
 * │  │   uses data-title           → accordion title                   │       │
 * │  │   uses data-html-content    → accordion body (HTML string)      │       │
 * │  │   uses data-step-number     → optional step badge               │       │
 * │  │                                                                  │       │
 * │  │ data-callout="important"  ──► <Callout variant="important" />   │       │
 * │  │ data-callout="info"       ──► <Callout /> (default: info)       │       │
 * │  │                                                                  │       │
 * │  │ (other divs)              ──► <View>{children}</View>           │       │
 * │  └──────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                     TTS PLAYER INTEGRATION                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  The bottom-bar TTS player (ReadButton) collects all <ReadableText>         │
 * │  components in the reading list, sorts them by vertical position, and       │
 * │  reads them sequentially with visual highlighting.                           │
 * │                                                                             │
 * │  ContentFromHtml wraps the <HTML> component in a <ReadableText> so its      │
 * │  content registers as a TTS reading item:                                   │
 * │                                                                             │
 * │  NORMAL BLOCKS (paragraphs, headings, callouts):                            │
 * │  ┌─────────────────────────────────────────┐                                │
 * │  │ <View>                                  │                                │
 * │  │   <ReadableText text={getTextForReading()}> ◄── registers in TTS list    │
 * │  │     <HTML ... />                        │       highlights on read        │
 * │  │   </ReadableText>                       │                                │
 * │  │ </View>                                 │                                │
 * │  └─────────────────────────────────────────┘                                │
 * │                                                                             │
 * │  TOGGLE BLOCKS (accordion directives):                                      │
 * │  ┌─────────────────────────────────────────┐                                │
 * │  │ <View>                                  │                                │
 * │  │   <HTML ... />  (NO ReadableText wrapper) ◄── AccordionAnimated has its  │
 * │  │ </View>                                 │     own ReadableTexts (title +  │
 * │  └─────────────────────────────────────────┘     body) that register in TTS  │
 * │                                                                             │
 * │  Why skip ReadableText for toggles?                                         │
 * │  An outer ReadableText would capture the entire accordion text (title +     │
 * │  body) as one TTS item, preventing AccordionAnimated's internal             │
 * │  ReadableTexts from being read individually. The TTS player would read      │
 * │  everything in one go without opening the accordion.                         │
 * │                                                                             │
 * │  getTextForReading() also prefixes callout titles ("Important.",             │
 * │  "Bon a savoir.") because these titles are rendered by React (in the        │
 * │  <Callout> component), not present in the source HTML.                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                     DATA FLOW SUMMARY                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  RI dispositif:                                                             │
 * │    Server DB (translations.fr.content) ──► HTML string ──► ContentFromHtml  │
 * │                                                                             │
 * │  RCO dispositif:                                                            │
 * │    Server DB (markdown field)                                               │
 * │      ──► markdownToHtmlBlocks() (MDAST split)                               │
 * │      ──► string[] (one HTML block per heading/directive/content group)       │
 * │      ──► ContentFromHtml[] (one instance per block)                          │
 * │                                                                             │
 * │  HTML from RI may contain:                                                  │
 * │    <div class="callout callout--important" data-callout="important">        │
 * │    <p>, <h2>, <h3>, <a>, <ul>, <li>, <strong>, <em>, <b>                   │
 * │                                                                             │
 * │  HTML from RCO/markdown may contain:                                        │
 * │    <div data-toggle="true" data-title="X" data-html-content="...">          │
 * │    <div data-callout="important">, <div data-callout="info">                │
 * │    <p>, <h2>, <h3>, <a>, <ul>, <li>, <strong>, <em>                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as React from "react";
import { Text, View } from "react-native";
import HTML from "react-native-render-html";
import sanitizeHtml from "sanitize-html";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { getScreenFromUrl } from "~/libs/getScreenFromUrl";
import { styles } from "~/theme";
import { RTLView } from "../BasicComponents";
import { Link } from "../Profil/Typography";
import { ReadableText, type ReadableTextRef } from "../ReadableText";
import { TextDSFR_L_Bold, TextDSFR_MD, TextDSFR_XL } from "../StyledText";
import { Callout } from "../typography";
import { AccordionAnimated } from "./AccordionAnimated";

interface Props {
  /** Raw HTML string to render (from RI structured content or RCO markdown pipeline). */
  htmlContent: string;
  /** Screen width in pixels — passed to react-native-render-html as contentWidth. */
  windowWidth: number;
  /** True when rendered inside AccordionAnimated's body. Adjusts TTS position measurement. */
  fromAccordion?: boolean;
  /** Theme color applied to h2/h3 headings. Falls back to black if not provided. */
  headingColor?: string;
}

/**
 * Strips all HTML tags from content and prepares it for TTS vocalization.
 *
 * Transformations applied before stripping:
 * - Adds spaces after `</p>` so the TTS reader pauses between paragraphs
 * - Adds a period + space after `</ul>` so lists end with a natural pause
 * - Removes HTML character entities (&amp;, &#123;, etc.) to avoid garbled speech
 *
 * @param htmlContent - Raw HTML string
 * @returns Plain text suitable for TTS reading
 */
const sanitizeForReading = (htmlContent: string) => {
  const htmlForReading = htmlContent
    .replaceAll("</p>", "</p> ")
    .replaceAll("</ul>", ".</ul> ")
    .replaceAll(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gm, "");
  return sanitizeHtml(htmlForReading, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

/**
 * ContentFromHtml — Renders an HTML string as native components.
 *
 * Accepts a `ref` (ReadableTextRef) so parent components (e.g. AccordionAnimated)
 * can link this instance to the TTS player's `currentItemRef` for auto-open behavior.
 */
export const ContentFromHtml = React.forwardRef<ReadableTextRef, Props>((props, ref) => {
  const { t, isRTL } = useTranslationWithRTL();

  const navigation = useNavigation();

  /**
   * Handles link presses from rendered `<a>` tags.
   * - Internal links (refugies.info): navigates within the app via React Navigation
   * - External links: opens in the system browser via expo-linking
   *
   * @param url - The href from the clicked link
   */
  const handleOpenUrl = (url: string) => {
    if (!url.includes("refugies.info")) Linking.openURL(url);
    const screen = getScreenFromUrl(url);
    if (screen)
      //@ts-expect-error navigation.navigate is not typed for nested navigators
      navigation.navigate(screen.rootNavigator, screen.screenParams);
  };

  /**
   * Detects if the HTML block is a standalone toggle (accordion directive).
   *
   * When true, we skip the ReadableText wrapper because AccordionAnimated
   * manages its own ReadableTexts internally (one for the title, one for the body).
   * An outer ReadableText would capture ALL text as a single TTS item, preventing
   * individual reading and blocking the auto-open mechanism (currentItemRef match).
   */
  const isToggleBlock = props.htmlContent.trimStart().startsWith("<div data-toggle=");

  /**
   * Builds the plain text string for TTS vocalization.
   *
   * Special cases:
   * - Toggle blocks → empty string (ReadableText is skipped entirely, see above)
   * - Callout blocks → prefixes "Important." or "Bon à savoir." before the content,
   *   because these titles are rendered by the React <Callout> component and are
   *   NOT present in the source HTML. Without this prefix, the TTS reader would
   *   skip the callout title entirely.
   * - Normal blocks → returns sanitized plain text as-is
   *
   * @returns Plain text for the ReadableText `text` prop
   */
  const getTextForReading = () => {
    if (isToggleBlock) return "";
    const sanitized = sanitizeForReading(props.htmlContent);
    const trimmed = props.htmlContent.trimStart();
    if (trimmed.startsWith('<div data-callout="important"')) {
      return `${t("content_screen.callout_important", "Important")}. ${sanitized}`;
    }
    if (trimmed.startsWith('<div data-callout="info"')) {
      return `${t("content_screen.callout_info", "Bon à savoir")}. ${sanitized}`;
    }
    return sanitized;
  };

  /**
   * The core HTML rendering element (react-native-render-html).
   *
   * Extracted as a variable so it can be conditionally wrapped (or not)
   * in a ReadableText component depending on block type (see return below).
   *
   * Configuration sections:
   * - classesStyles: RI legacy CSS classes (bloc-rouge, icon-left-side, etc.)
   * - tagsStyles: Base styling for HTML tags (strong, em, b, h2, h3)
   * - baseFontStyle: Default font (Marianne Regular, DSFR font family)
   * - renderers: Custom React Native components for each HTML tag
   */
  const htmlContent = (
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
        h2: {
          fontSize: styles.fonts.sizes.xl,
          fontFamily: styles.fonts.families.marianneBold,
          lineHeight: 32,
          fontWeight: null,
          color: props.headingColor || styles.colors.black,
        },
        h3: {
          fontSize: styles.fonts.sizes.l,
          fontFamily: styles.fonts.families.marianneBold,
          lineHeight: 28,
          fontWeight: null,
          color: props.headingColor || styles.colors.black,
        },
      }}
      baseFontStyle={{
        fontSize: styles.fonts.sizes.md,
        fontFamily: styles.fonts.families.marianneReg,
        textAlign: isRTL ? "right" : "left",
        lineHeight: 20,
      }}
      renderers={{
        /** h2 → DSFR XL heading with theme color and accessibilityRole="header" */
        h2: (_, children, _cssStyles, passProps) => (
          <TextDSFR_XL
            key={passProps.key}
            color={props.headingColor}
            style={{
              marginTop: styles.margin * 2,
              marginBottom: styles.margin * 3,
            }}
            accessibilityRole="header"
          >
            {children}
          </TextDSFR_XL>
        ),
        /** h3 → DSFR L Bold heading with theme color and accessibilityRole="header" */
        h3: (_, children, _cssStyles, passProps) => (
          <TextDSFR_L_Bold
            key={passProps.key}
            color={props.headingColor}
            style={{
              marginTop: styles.margin * 2,
              marginBottom: styles.margin * 2,
            }}
            accessibilityRole="header"
          >
            {children}
          </TextDSFR_L_Bold>
        ),
        /** a → Link component with in-app or external navigation */
        a: (attrs, children, _cssStyles, passProps) => (
          <Link
            accessibilityRole="link"
            onPress={() => handleOpenUrl(attrs.href.toString())}
            key={passProps.key}
          >
            {children}
          </Link>
        ),
        /** ul → Vertical flex column for list items */
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
        /** li → RTL-aware row with bullet point (●) + text content */
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
        /** p → DSFR Medium paragraph with bottom margin */
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
        /**
         * div → Dispatched by data-* attributes to specialized components:
         * - data-toggle="true"        → AccordionAnimated (collapsible section)
         * - data-callout="important"  → Callout variant="important" (warning card)
         * - data-callout="info"       → Callout default (info card, "Bon à savoir")
         * - (no data attribute)       → Plain View wrapper
         *
         * For toggles, data-html-content carries the pre-serialized HTML of the
         * accordion body (set by remarkDirectiveToHtml in the markdown pipeline).
         * AccordionAnimated renders it via its own internal ContentFromHtml.
         */
        div: (_, children, _cssStyles, passProps) => {
          if (_["data-toggle"] === "true") {
            return (
              <AccordionAnimated
                key={passProps.key}
                title={String(_["data-title"] || "")}
                content={String(_["data-html-content"] || "")}
                windowWidth={props.windowWidth}
                stepNumber={_["data-step-number"] ? Number(_["data-step-number"]) : null}
                currentLanguage={null}
                darkColor={styles.colors.darkGrey}
                lightColor={styles.colors.lightGrey}
                isContentTranslated={false}
                isAccordionEngagement={false}
                contentId=""
              />
            );
          }

          if (_["data-callout"] === "important") {
            return (
              <Callout key={passProps.key} variant="important">
                {children}
              </Callout>
            );
          }

          if (_["data-callout"] === "info") {
            return <Callout key={passProps.key}>{children}</Callout>;
          }

          return <View key={passProps.key}>{children}</View>;
        },
      }}
    />
  );

  /**
   * Conditional wrapping:
   *
   * - TOGGLE blocks: rendered bare (no ReadableText). AccordionAnimated handles
   *   its own TTS registration with separate ReadableTexts for title and body.
   *
   * - ALL OTHER blocks: wrapped in ReadableText which registers this content
   *   in the TTS player's reading list. The `ref` prop allows AccordionAnimated
   *   to link this instance via currentItemRef for auto-open on TTS playback.
   *   `heightOffset` adjusts position measurement when inside an accordion body.
   */
  return (
    <View>
      {isToggleBlock ? (
        htmlContent
      ) : (
        <ReadableText ref={ref} text={getTextForReading()} heightOffset={props.fromAccordion}>
          {htmlContent}
        </ReadableText>
      )}
    </View>
  );
});

ContentFromHtml.displayName = "ContentFromHtml";
