import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import flattenDeep from "lodash/flattenDeep";
import { GetTraductionsForReview, TranslationContent } from "api-types";

export const filterAndTransformTranslations = (section: string, traductions: GetTraductionsForReview[] | null) =>
  !traductions
    ? []
    : traductions
      // Filtre les suggestions non pertinentes pour cette section
      .filter((traduction) => !isUndefined(get(traduction.translated, section)))
      .map((traduction) => ({
        username: traduction.username,
        author: traduction.author,
        text: get(traduction.translated, section),
      }));

export const keysForSubSection = (prefix: string, translated: TranslationContent) =>
  flattenDeep(
    Object.keys(get(translated, prefix, {})).map((key) => [`${prefix}.${key}.title`, `${prefix}.${key}.text`]),
  );

export const keys = (translated: TranslationContent) => {
  return [
    ...Object.keys(translated.content)
      .filter((key) => !["how", "why", "next"].includes(key))
      .map((key) => `content.${key}`),
    ...keysForSubSection("content.why", translated),
    ...keysForSubSection("content.how", translated),
    ...keysForSubSection("content.next", translated),
  ];
};
