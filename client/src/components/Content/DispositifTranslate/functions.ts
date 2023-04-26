import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import flattenDeep from "lodash/flattenDeep";
import { GetTraductionsForReview, GetUserInfoResponse, Picture, TranslationContent } from "api-types";
import { TranslateForm } from "hooks/dispositif/useDispositifTranslateForm";
import { DeepPartialSkipArrayKey } from "react-hook-form";

export type Suggestion = {
  author: {
    id: string
    username: string
    picture?: Picture
  }
  text: string
  toFinish: boolean
  toReview: boolean
}

export const transformMyTranslation = (section: string, traductions: DeepPartialSkipArrayKey<TranslateForm>, user: GetUserInfoResponse | null): Suggestion => {
  return {
    author: {
      id: user?._id.toString() || "",
      username: user?.username || ""
    },
    text: get(traductions.translated, section) || "",
    toFinish: !!(traductions.toFinish || []).find(t => t === section),
    toReview: !!(traductions.toReview || []).find(t => t === section),
  }
}

export const filterAndTransformTranslations = (section: string, traductions: GetTraductionsForReview[] | null): Suggestion[] =>
  !traductions
    ? []
    : traductions
      // Filtre les suggestions non pertinentes pour cette section
      .filter((traduction) => !isUndefined(get(traduction.translated, section)))
      .map((traduction) => ({
        author: traduction.author,
        text: get(traduction.translated, section) || "",
        toFinish: !!traduction.toFinish.find(t => t === section),
        toReview: !!(traduction.toReview || []).find(t => t === section),
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

export const getInputSize = (section: string): "xl" | "lg" | undefined => {
  if (section === "content.titreInformatif") return "xl"
  if (section.includes(".title")) return "lg"
  return undefined
}
export const isInputHTML = (section: string): boolean => {
  return section === "content.what" || section.includes(".text")
}
