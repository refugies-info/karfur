import { DeepPartialSkipArrayKey } from "react-hook-form";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { GetTraductionsForReview, GetTraductionsForReviewResponse, GetUserInfoResponse } from "api-types";
import { TranslateForm } from "../useDispositifTranslateForm";
import { Suggestion } from "./useDispositifTranslation";

/**
 * Returns a Suggestion from the TranslateForm
 */
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

/**
 * Returns a list of suggestions from all the translations
 */
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

/**
 * Returns the size of the input, or undefined if default
 */
export const getInputSize = (section: string): "xl" | "lg" | undefined => {
  if (section === "content.titreInformatif") return "xl"
  if (section.includes(".title")) return "lg"
  return undefined
}

/**
 * Should the input receive HTML or plain text
 */
export const isInputHTML = (section: string): boolean => {
  return section === "content.what" || section.includes(".text")
}

/**
 * Get all suggestions except mine
 */
export const getInitialTranslations = (userId: string, traductions: GetTraductionsForReviewResponse) => {
  return traductions.filter(t => t.author.id !== userId.toString())
}
