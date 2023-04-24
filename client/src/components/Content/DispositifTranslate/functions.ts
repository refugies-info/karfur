import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import flattenDeep from "lodash/flattenDeep";
import { GetTraductionsForReview, TranslationContent } from "api-types";

export type Suggestion = {
  username: string
  author: string
  text: string
  toFinish: boolean
  toReview: boolean
}

export const transformOneTranslation = (section: string, traductions: GetTraductionsForReview): Suggestion => {
  return {
    username: traductions.username,
    author: traductions.author,
    text: get(traductions.translated, section) || "",
    toFinish: !!traductions.toFinish.find(t => t === section),
    toReview: !!(traductions.toReview || []).find(t => t === section),
  }
}

export const filterAndTransformTranslations = (section: string, traductions: GetTraductionsForReview[] | null): Suggestion[] =>
  !traductions
    ? []
    : traductions
      // Filtre les suggestions non pertinentes pour cette section
      .filter((traduction) => !isUndefined(get(traduction.translated, section)))
      .map((traduction) => transformOneTranslation(section, traduction));

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

export const getInputSize = (section: string): "xl" | "lg" | undefined => {
  if (section === "content.titreInformatif") return "xl"
  if (section.includes(".title")) return "lg"
  return undefined
}
export const isInputHTML = (section: string): boolean => {
  return section === "content.what" || section.includes(".text")
}
