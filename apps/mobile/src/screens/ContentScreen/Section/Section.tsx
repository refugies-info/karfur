import { ContentType, type Id, type InfoSections } from "@refugies-info/api-types";
import { memo, useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { AccordionAnimated, ContentFromHtml, ReadableText, Title } from "~/components";
import { useTranslationWithRTL } from "~/hooks";
import { defaultColors, markdownToHtml } from "~/libs";
import { currentI18nCodeSelector, selectedContentSelector, themeSelector } from "~/services";
import { styles } from "~/theme";

export interface SectionProps {
  sectionKey: "what" | "how" | "why" | "next";
  themeId: Id | null;
}

const LAYOUT_CONSTANTS = {
  HORIZONTAL_PADDING: 24, // Main container padding
  ICON_SIZE: 16, // Icons in accordion
  STEP_NUMBER_WIDTH: 32, // Step number bubble width
  GAP: 24, // internal gaps
};

const SectionComponent = ({ sectionKey, themeId }: SectionProps) => {
  const { t } = useTranslationWithRTL();

  const windowWidth = useWindowDimensions().width;

  // Calculate available width for accordion content
  // Formula: Screen - Padding*2 - Icons - Gaps - (Optional Step Number)
  const accordionMaxWidthWithoutStep = useMemo(
    () =>
      windowWidth -
      LAYOUT_CONSTANTS.HORIZONTAL_PADDING * 2 -
      LAYOUT_CONSTANTS.ICON_SIZE * 3 -
      LAYOUT_CONSTANTS.GAP,
    [windowWidth],
  );

  const accordionMaxWidthWithStep = useMemo(
    () =>
      accordionMaxWidthWithoutStep -
      LAYOUT_CONSTANTS.STEP_NUMBER_WIDTH -
      LAYOUT_CONSTANTS.ICON_SIZE,
    [accordionMaxWidthWithoutStep],
  );

  const currentLanguage = useSelector(currentI18nCodeSelector);
  const dispositif = useSelector(selectedContentSelector(currentLanguage));
  const theme = useSelector(themeSelector(themeId?.toString() || null));

  // --- Content Loading ---
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const processMarkdown = async () => {
      const mdContent = dispositif?.markdown;
      if (sectionKey === "what" && mdContent) {
        const html = await markdownToHtml(mdContent);
        if (isMounted) setMarkdownHtml(html);
      } else {
        if (isMounted) setMarkdownHtml(null);
      }
    };
    if (dispositif) processMarkdown();
    return () => {
      isMounted = false;
    };
  }, [dispositif, sectionKey]);

  if (!dispositif) return null;

  // --- Derived Data ---
  const contentHtml = useMemo(() => {
    if (markdownHtml) return markdownHtml;
    return sectionKey === "what" ? dispositif[sectionKey] || "" : undefined;
  }, [sectionKey, dispositif, markdownHtml]);

  const contentAccordions = useMemo(
    () => (sectionKey !== "what" ? dispositif[sectionKey] : undefined),
    [sectionKey, dispositif],
  );

  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);

  const width = useMemo(
    () =>
      dispositif.typeContenu === ContentType.DEMARCHE
        ? accordionMaxWidthWithStep
        : accordionMaxWidthWithoutStep,
    [dispositif.typeContenu, accordionMaxWidthWithStep, accordionMaxWidthWithoutStep],
  );

  const title = useMemo(() => {
    return dispositif.typeContenu === ContentType.DISPOSITIF && sectionKey === "how"
      ? t("content_screen.how_to_do")
      : t("content_screen." + sectionKey, sectionKey);
  }, [sectionKey, dispositif, t]);

  // --- Render Helpers ---
  const renderContent = () => {
    if (contentHtml !== undefined) {
      return <ContentFromHtml htmlContent={contentHtml} windowWidth={windowWidth} />;
    }

    if (contentAccordions) {
      return Object.entries(contentAccordions).map(([key, section], index) => (
        <AccordionAnimated
          title={section.title}
          content={section.text}
          key={key}
          stepNumber={
            dispositif.typeContenu === ContentType.DEMARCHE && sectionKey === "how"
              ? index + 1
              : null
          }
          width={width}
          currentLanguage={currentLanguage}
          windowWidth={windowWidth}
          darkColor={colors.color100}
          lightColor={colors.color30}
          isContentTranslated
          isAccordionEngagement={sectionKey === "next"}
          contentId={dispositif._id.toString()}
        />
      ));
    }
    return null;
  };

  return (
    <View style={{ marginBottom: styles.margin * 5 }}>
      <Title color={colors.color100} accessibilityRole="header">
        <ReadableText>{title}</ReadableText>
      </Title>
      <View>{renderContent()}</View>
    </View>
  );
};

export const Section = memo(SectionComponent);
