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

const LAYOUT = {
  HORIZONTAL_PADDING: 24,
  ICON_SIZE: 16,
  STEP_NUMBER_WIDTH: 32,
  GAP: 24,
};

/**
 * Hook to calculate the optimal width for accordions based on screen size and content type.
 */
const useAccordionWidth = (typeContenu?: ContentType) => {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    const maxWidthWithoutStep =
      windowWidth - LAYOUT.HORIZONTAL_PADDING * 2 - LAYOUT.ICON_SIZE * 3 - LAYOUT.GAP;

    if (typeContenu === ContentType.DEMARCHE) {
      return maxWidthWithoutStep - LAYOUT.STEP_NUMBER_WIDTH - LAYOUT.ICON_SIZE;
    }
    return maxWidthWithoutStep;
  }, [windowWidth, typeContenu]);
};

/**
 * Hook to asynchronously process Markdown content to HTML.
 */
const useMarkdownContent = (sectionKey: string, markdown?: string | null) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const process = async () => {
      if (sectionKey === "what" && markdown) {
        const result = await markdownToHtml(markdown);
        if (isMounted) setHtml(result);
      } else {
        if (isMounted) setHtml(null);
      }
    };
    process();
    return () => {
      isMounted = false;
    };
  }, [sectionKey, markdown]);

  return html;
};

const SectionComponent = ({ sectionKey, themeId }: SectionProps) => {
  const { t } = useTranslationWithRTL();
  const { width: windowWidth } = useWindowDimensions();

  // Selectors
  const currentLanguage = useSelector(currentI18nCodeSelector);
  const dispositif = useSelector(selectedContentSelector(currentLanguage));
  const theme = useSelector(themeSelector(themeId?.toString() || null));

  // Derived Values
  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);
  const markdownHtml = useMarkdownContent(sectionKey, dispositif?.markdown);
  const accordionWidth = useAccordionWidth(dispositif?.typeContenu);

  // Content Resolution
  const contentHtml = useMemo(() => {
    if (markdownHtml) return markdownHtml;
    return sectionKey === "what" ? dispositif?.[sectionKey] || "" : undefined;
  }, [sectionKey, dispositif, markdownHtml]);

  const contentAccordions = useMemo<InfoSections | undefined>(
    () => (sectionKey !== "what" ? dispositif?.[sectionKey] : undefined),
    [sectionKey, dispositif],
  );

  const title = useMemo(() => {
    if (!dispositif) return "";
    return dispositif.typeContenu === ContentType.DISPOSITIF && sectionKey === "how"
      ? t("content_screen.how_to_do")
      : t(`content_screen.${sectionKey}`, sectionKey);
  }, [sectionKey, dispositif, t]);

  if (!dispositif) return null;

  // Render Logic
  const renderContent = () => {
    // 1. HTML Content (What section or Markdown)
    if (contentHtml !== undefined) {
      return (
        <ContentFromHtml
          htmlContent={contentHtml}
          windowWidth={windowWidth}
          darkColor={colors.color100}
          lightColor={colors.color30}
        />
      );
    }

    // 2. Accordions (How / Why / Next)
    if (contentAccordions) {
      return Object.entries(contentAccordions).map(([key, section], index) => (
        <AccordionAnimated
          key={key}
          title={section.title}
          content={section.text}
          /* Layout Props */
          width={accordionWidth}
          windowWidth={windowWidth}
          /* Step Number Logic */
          stepNumber={
            dispositif.typeContenu === ContentType.DEMARCHE && sectionKey === "how"
              ? index + 1
              : null
          }
          /* Theming */
          darkColor={colors.color100}
          lightColor={colors.color30}
          /* Translation & Keys */
          currentLanguage={currentLanguage}
          contentId={dispositif._id.toString()}
          isContentTranslated
          isAccordionEngagement={sectionKey === "next"}
        />
      ));
    }

    return null;
  };

  return (
    <View style={{ marginBottom: styles.margin * 5 }}>
      <ReadableText text={title} darkBg={false}>
        <Title color={colors.color100} accessibilityRole="header">
          {title}
        </Title>
      </ReadableText>
      <View>{renderContent()}</View>
    </View>
  );
};

export const Section = memo(SectionComponent);
