import { DispositifStatus, type Languages } from "@refugies-info/api-types";
import type { TranslationContent } from "@refugies-info/mongo";
import {
  type Dispositif,
  isDocument,
  type Traductions,
  TraductionsStatus,
  TraductionsType,
  type User,
} from "@refugies-info/mongo";
import { difference, flattenDeep, get, intersection, isEmpty } from "lodash";
import { MustBePopulatedError } from "~/errors";
import { countDispositifWords } from "~/libs/wordCounter";
import { getDispositifTranslation } from "../dispositif/dispositif.business";

export interface TraductionDiff {
  added: string[];
  modified: string[];
  removed: string[];
}

const keysForSubSection = (prefix: string, translated: unknown) =>
  flattenDeep(
    Object.keys(get(translated, prefix, {})).map((key) => {
      const arr = [];
      if (!isEmpty(get(translated, `${prefix}.${key}.title`, ""))) {
        arr.push(`${prefix}.${key}.title`);
      }
      if (!isEmpty(get(translated, `${prefix}.${key}.text`, ""))) {
        arr.push(`${prefix}.${key}.text`);
      }
      return arr;
    }),
  );

const removeEmptyValues = (
  keys: (keyof TranslationContent)[],
  translationObject: Partial<TranslationContent>,
) => {
  return keys.filter((key: keyof TranslationContent) => {
    const value = get(translationObject, key);
    return value !== null && value !== undefined && value.toString().trim() !== "";
  });
};

type Content = Partial<TranslationContent> & {
  metadatas?: unknown;
};

const keys = (translated: Content) => {
  return [
    ...Object.keys(translated?.content || {})
      .filter((key) => !["how", "why", "next"].includes(key))
      .map((key) => `content.${key}`),
    ...keysForSubSection("content.why", translated),
    ...keysForSubSection("content.how", translated),
    ...keysForSubSection("content.next", translated),
    ...Object.keys(translated?.metadatas || {}).map((key) => `metadatas.${key}`),
  ];
};

export const getTraductionStatus = (traduction: Traductions): TraductionsStatus => {
  if (traduction.type === TraductionsType.VALIDATION) {
    // Check if toReview is empty or undefined
    const isToReviewEmpty = !traduction.toReview || traduction.toReview.length === 0;
    return isToReviewEmpty && traduction.finished
      ? TraductionsStatus.VALIDATED
      : TraductionsStatus.TO_REVIEW;
  }

  // if type === "suggestion"
  return traduction.finished ? TraductionsStatus.PENDING : TraductionsStatus.TO_TRANSLATE;
};

export const getTraductionWordsCount = (traduction: Traductions): number => {
  return countDispositifWords(traduction.translated.content as any);
};

export const getTraductionUser = (traduction: Traductions): User => {
  if (!traduction.userId || !isDocument(traduction.userId)) {
    throw new MustBePopulatedError("userId");
  }
  return traduction.userId as unknown as User;
};

export const diffTraductions = (
  origin: TranslationContent,
  compareTo: TranslationContent,
): TraductionDiff => {
  const originKeys = keys(origin) as (keyof TranslationContent)[];
  const compareToKeys = keys(compareTo) as (keyof TranslationContent)[];
  // ces champs devront être traduits impérativement => to review
  const added = removeEmptyValues(difference(compareToKeys, originKeys), compareTo);
  // les champs supprimés peuvent être traités automatiquement sans re-traduction
  const removed = difference(originKeys, compareToKeys);

  const intersec = intersection(originKeys, compareToKeys);
  const modified = intersec.filter((section) => get(origin, section) !== get(compareTo, section));

  return { added, modified, removed };
};

export const computeTraductionFinished = (
  dispositif: Dispositif,
  translation: Traductions,
): boolean => {
  const frTranslation = getDispositifTranslation(dispositif, "fr");
  if (!frTranslation) return false;

  const dispositifSectionsCounter = removeEmptyValues(
    keys(frTranslation) as (keyof TranslationContent)[],
    frTranslation,
  ).length;

  const translationSectionsCounter = removeEmptyValues(
    keys(translation.translated) as (keyof TranslationContent)[],
    translation.translated,
  ).length;

  const notFinished = [
    ...new Set([...(translation.toFinish || []), ...(translation.toReview || [])]),
  ].length;

  if (dispositifSectionsCounter === 0) return true; // Avoid division by zero

  return (translationSectionsCounter - notFinished) / dispositifSectionsCounter >= 1;
};

export const getSectionsTranslated = (traduction: Traductions): string[] => {
  const translatedSections = keys(traduction.translated);
  const notFinished = [
    ...new Set([...(traduction.toFinish || []), ...(traduction.toReview || [])]),
  ];
  return translatedSections.filter((t) => !notFinished.includes(t));
};
