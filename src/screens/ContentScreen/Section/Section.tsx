import React, { useMemo } from "react";
import { ContentType, InfoSections } from "@refugies-info/api-types";
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

export interface SectionProps {
  contentType: ContentType;
  sectionKey: "what" | "how" | "why" | "next";
}

const Section = ({ contentType, sectionKey }: SectionProps) => {
  const { t } = useTranslationWithRTL();

  const windowWidth = useWindowDimensions().width;
  const accordionMaxWidthWithStep = windowWidth - 2 * 24 - 4 * 16 - 24 - 32;
  const accordionMaxWidthWithoutStep = windowWidth - 2 * 24 - 3 * 16 - 24;

  const currentLanguage = useSelector(currentI18nCodeSelector);
  const dispositif = useSelector(selectedContentSelector(currentLanguage));

  const theme = useSelector(
    themeSelector(dispositif?.theme?.toString() || null)
  );

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

  const colors = theme?.colors || defaultColors;

  return (
    <View>
      <Title color={colors.color100}>
        <ReadableText>
          {t("content_screen." + sectionKey, sectionKey)}
        </ReadableText>
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
                dispositif.typeContenu === ContentType.DEMARCHE
                  ? index + 1
                  : null
              }
              width={
                dispositif.typeContenu === ContentType.DEMARCHE
                  ? accordionMaxWidthWithStep
                  : accordionMaxWidthWithoutStep
              }
              currentLanguage={currentLanguage}
              windowWidth={windowWidth}
              darkColor={colors.color100}
              lightColor={colors.color30}
              isContentTranslated
              shouldTriggerFirebaseEvent={sectionKey === "next"}
              contentId={dispositif._id.toString()}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Section;
