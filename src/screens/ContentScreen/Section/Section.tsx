import React, { memo, useMemo } from "react";
import { ContentType, Id, InfoSections } from "@refugies-info/api-types";
import { useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";
import {
  AccordionAnimated,
  ContentFromHtml,
  ReadableText,
  Title,
} from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import {
  currentI18nCodeSelector,
  selectedContentSelector,
  themeSelector,
} from "../../../services";
import { defaultColors } from "../../../libs";
import { styles } from "../../../theme";

export interface SectionProps {
  sectionKey: "what" | "how" | "why" | "next";
  themeId: Id | null;
}

const SectionComponent = ({ sectionKey, themeId }: SectionProps) => {
  const { t } = useTranslationWithRTL();

  const windowWidth = useWindowDimensions().width;
  const accordionMaxWidthWithStep = useMemo(
    () => windowWidth - 2 * 24 - 4 * 16 - 24 - 32,
    [windowWidth]
  );
  const accordionMaxWidthWithoutStep = useMemo(
    () => windowWidth - 2 * 24 - 3 * 16 - 24,
    [windowWidth]
  );

  const currentLanguage = useSelector(currentI18nCodeSelector);
  const dispositif = useSelector(selectedContentSelector(currentLanguage));

  const theme = useSelector(themeSelector(themeId?.toString() || null));

  if (!dispositif) return null;

  // content
  const contentHtml: string | undefined = useMemo(
    () => (sectionKey === "what" ? dispositif[sectionKey] || "" : undefined),
    [sectionKey, dispositif]
  );
  const contentAccordions: InfoSections | undefined = useMemo(
    () => (sectionKey !== "what" ? dispositif[sectionKey] : undefined),
    [sectionKey, dispositif]
  );

  const colors = useMemo(() => theme?.colors || defaultColors, [theme]);
  const title = useMemo(() => {
    return dispositif.typeContenu === ContentType.DISPOSITIF &&
      sectionKey === "how"
      ? t("content_screen.how_to_do")
      : t("content_screen." + sectionKey, sectionKey);
  }, [sectionKey, dispositif]);

  return (
    <View style={{ marginBottom: styles.margin * 5 }}>
      <Title color={colors.color100} accessibilityRole="header">
        <ReadableText>{title}</ReadableText>
      </Title>
      <View>
        {contentHtml !== undefined ? (
          <ContentFromHtml
            htmlContent={contentHtml}
            windowWidth={windowWidth}
          />
        ) : (
          contentAccordions &&
          Object.entries(contentAccordions).map(([key, section], index) => (
            <AccordionAnimated
              title={section.title}
              content={section.text}
              key={key}
              stepNumber={
                dispositif.typeContenu === ContentType.DEMARCHE &&
                sectionKey === "how"
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
