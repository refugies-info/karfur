import { ContentType, type Id, type InfoSections } from "@refugies-info/api-types";
import { memo, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { AccordionAnimated, ContentFromHtml, ReadableText, Title } from "~/components";
import { useTranslationWithRTL } from "~/hooks";
import { defaultColors } from "~/libs";
import { markdownToHtmlBlocks } from "~/libs/markdown";
import { currentI18nCodeSelector, selectedContentSelector, themeSelector } from "~/services";
import { styles } from "~/theme";

export interface SectionProps {
  sectionKey: "what" | "how" | "why" | "next";
  themeId: Id | null;
}

const SectionComponent = ({ sectionKey, themeId }: SectionProps) => {
  const { t } = useTranslationWithRTL();

  const windowWidth = useWindowDimensions().width;
  const accordionMaxWidthWithStep = useMemo(
    () => windowWidth - 2 * 24 - 4 * 16 - 24 - 32,
    [windowWidth],
  );
  const accordionMaxWidthWithoutStep = useMemo(
    () => windowWidth - 2 * 24 - 3 * 16 - 24,
    [windowWidth],
  );

  const currentLanguage = useSelector(currentI18nCodeSelector);
  const dispositif = useSelector(selectedContentSelector(currentLanguage));

  const theme = useSelector(themeSelector(themeId?.toString() || null));

  if (!dispositif) return null;

  // Determine if this dispositif uses markdown content (e.g. RCO)
  const hasMarkdown = "markdown" in dispositif && !!dispositif.markdown;

  // For RCO: split markdown into HTML blocks (one ReadableText per block for TTS)
  const htmlBlocks: string[] = useMemo(() => {
    if (sectionKey !== "what" || !hasMarkdown) return [];
    return markdownToHtmlBlocks(dispositif.markdown);
  }, [sectionKey, dispositif, hasMarkdown]);

  // For RI: use the existing HTML content from dispositif.what
  const contentHtml: string | undefined = useMemo(() => {
    if (sectionKey !== "what") return undefined;
    if (hasMarkdown) return undefined; // handled by htmlBlocks
    return dispositif.what || "";
  }, [sectionKey, dispositif, hasMarkdown]);

  // For non-"what" sections (how/why/next): only available for RI dispositifs
  const contentAccordions: InfoSections | undefined = useMemo(() => {
    if (sectionKey === "what") return undefined;
    if (hasMarkdown) return undefined; // RCO has no structured sections
    return dispositif[sectionKey];
  }, [sectionKey, dispositif, hasMarkdown]);

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
  }, [sectionKey, dispositif]);

  // For RCO dispositifs, only the "what" section has content
  if (hasMarkdown && sectionKey !== "what") return null;

  // For RI dispositifs, skip if no content for this section
  if (!hasMarkdown && !contentHtml && !contentAccordions) return null;
  // For RCO dispositifs, skip if no blocks
  if (hasMarkdown && htmlBlocks.length === 0) return null;

  return (
    <View style={{ marginBottom: styles.margin * 5 }}>
      {!dispositif.markdown && (
        <Title color={colors.color100} accessibilityRole="header">
          <ReadableText>{title}</ReadableText>
        </Title>
      )}
      <View>
        {htmlBlocks.length > 0 ? (
          htmlBlocks.map((html, i) => (
            <ContentFromHtml
              key={i}
              htmlContent={html}
              windowWidth={windowWidth}
              headingColor={colors.color100}
            />
          ))
        ) : contentHtml !== undefined ? (
          <ContentFromHtml
            htmlContent={contentHtml}
            windowWidth={windowWidth}
            headingColor={colors.color100}
          />
        ) : (
          contentAccordions &&
          Object.entries(contentAccordions).map(([key, section], index) => (
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
          ))
        )}
      </View>
    </View>
  );
};

export const Section = memo(SectionComponent);
