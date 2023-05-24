import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useFormContext, useWatch } from "react-hook-form";
import get from "lodash/get";
import { useUser } from "hooks";
import { ContentType, GetTraductionsForReview, GetTraductionsForReviewResponse, Languages, Picture, TranslationContent } from "@refugies-info/api-types";
import { TranslateForm } from "../useDispositifTranslateForm";
import {
  filterAndTransformTranslations,
  getInitialTranslations,
  getInputSize,
  isInputHTML,
  transformMyTranslation
} from "./suggestionFunctions";
import {
  calculateProgressTranslate,
  getMaxStepsTranslate,
  getMissingStepsTranslate,
  getPendingStepsTranslate,
  getSectionWordCount,
  getWordsCount,
  keys,
} from "./progressFunctions";

export type Step = "titreInformatif" | "titreMarque" | "what" | "why" | "how" | "how" | "next" | "abstract";
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

export type Progress = {
  totalSteps: number;
  doneSteps: number;
  totalWords: number;
  doneWords: number;
  myDoneWords: number;
  missingSteps: Step[];
  pendingSteps: Step[];
  reviewSteps: Step[];
  isComplete: boolean;
}

/**
 * Gets the translations data in input, and returns everything needed by the TranslationInput to work
 * @param traductions - all the translations
 * @param defaultTraduction - initial text in FR
 * @returns a functions which gets all the props for the TranslationInput
 */
const useDispositifTranslation = (traductions: GetTraductionsForReviewResponse, defaultTraduction: TranslationContent, typeContenu: ContentType) => {
  const { user } = useUser();
  const router = useRouter();
  const { setValue } = useFormContext<TranslateForm>();
  const data = useWatch<TranslateForm>();
  const [translations, _setTranslations] = useState<GetTraductionsForReview[]>(
    getInitialTranslations(user.userId.toString(), traductions)
  );
  const language = useMemo(() => router.query.language as Languages, [router.query]);

  // PROGRESS
  const dispositifSections = useMemo(() => keys(defaultTraduction), [defaultTraduction]);
  const totalSteps = useMemo(() => getMaxStepsTranslate(defaultTraduction), [defaultTraduction]);
  const doneSteps = useMemo(
    () => calculateProgressTranslate(data, translations, typeContenu, defaultTraduction, user.expertTrad),
    [data, translations, typeContenu, defaultTraduction, user.expertTrad],
  );
  const missingSteps = useMemo(
    () =>
      getMissingStepsTranslate(data, translations, typeContenu, defaultTraduction, user.expertTrad),
    [data, translations, typeContenu, defaultTraduction, user.expertTrad],
  );
  const isComplete = useMemo(() => doneSteps === totalSteps, [doneSteps, totalSteps]);
  const sectionWordCount = useMemo(() => getSectionWordCount(defaultTraduction), [defaultTraduction]);
  const pendingSteps = useMemo(() => getPendingStepsTranslate(data, "toFinish"), [data]);
  const reviewSteps = useMemo(() => getPendingStepsTranslate(data, "toReview"), [data]);
  const wordsCount = useMemo(() => getWordsCount(
    sectionWordCount, data, translations, user.expertTrad
  ), [sectionWordCount, data, translations, user.expertTrad]);
  const myWordsCount = useMemo(() => getWordsCount(
    sectionWordCount, data, [], true
  ), [sectionWordCount, data]);

  const progress: Progress = useMemo(() => ({
    totalSteps,
    doneSteps,
    missingSteps,
    isComplete,
    doneWords: wordsCount.done,
    totalWords: wordsCount.total,
    myDoneWords: myWordsCount.done,
    pendingSteps,
    reviewSteps
  }), [totalSteps, doneSteps, missingSteps, isComplete, wordsCount, pendingSteps, reviewSteps, myWordsCount]);

  // SAVING
  /**
   * Valide la traduction de la section en cours pour la traduction de l'utilisateur courant
   */
  const validate = useCallback(
    async (section: string, value: { text?: string, unfinished?: boolean }) => {
      // if section changed, remove from toReview
      if (data.toReview && data.toReview.includes(section)) {
        const toReview = [...data.toReview].filter(t => t !== section)
        setValue("toReview", toReview);
      }

      if (value.unfinished !== undefined) {
        const toFinish = value.unfinished
          ? [...(data.toFinish || []), section]
          : [...(data.toFinish || [])].filter(t => t !== section)
        setValue("toFinish", toFinish);
      }
      if (value.text !== undefined) {
        //@ts-ignore
        setValue(`translated.${section}`, value.text)
      }
    },
    [data, setValue],
  );

  const deleteTrad = useCallback(
    async (section: string) => {
      const toFinish = [...(data.toFinish || [])].filter(t => t !== section)
      setValue("toFinish", toFinish);
      //@ts-ignore
      setValue(`translated.${section}`, undefined)
    },
    [data, setValue],
  );

  // INPUT
  const getInputProps = useCallback(
    (section: string) => {
      return {
        section,
        initialText: get(defaultTraduction, section),
        mySuggestion: transformMyTranslation(section, data, user.user),
        suggestions: filterAndTransformTranslations(section, translations),
        locale: language,
        validate,
        deleteTrad,
        isHTML: isInputHTML(section),
        size: getInputSize(section),
        noAutoTrad: section.includes("titreMarque"),
        maxLength: section.includes("abstract") ? 110 : undefined,
      };
    },
    [defaultTraduction, translations, language, validate, deleteTrad, data, user],
  );

  return {
    locale: language,
    progress,
    dispositifSections,
    getInputProps,
  };
};

export default useDispositifTranslation;
