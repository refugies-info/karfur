import { DeepPartialSkipArrayKey } from "react-hook-form";
import get from "lodash/get";
import flattenDeep from "lodash/flattenDeep";
import { ContentType, DemarcheContent, DispositifContent, GetTraductionsForReview, InfoSections, TranslationContent } from "@refugies-info/api-types";
import { TranslateForm } from "../useDispositifTranslateForm";
import { Step } from "./useDispositifTranslation";

export const keysForSubSection = (prefix: string, translated: DeepPartialSkipArrayKey<TranslationContent>) =>
  flattenDeep(
    Object.keys(get(translated, prefix, {})).map((key) => [`${prefix}.${key}.title`, `${prefix}.${key}.text`]),
  );

export const keys = (translated: DeepPartialSkipArrayKey<TranslationContent> | undefined) => {
  if (!translated) return [];
  return [
    ...Object.keys(translated.content || {})
      .filter((key) => !["how", "why", "next"].includes(key))
      .map((key) => `content.${key}`),
    ...keysForSubSection("content.why", translated),
    ...keysForSubSection("content.how", translated),
    ...keysForSubSection("content.next", translated),
  ];
};

const countWords = (text: string | undefined) => !text ? 0 : text
  .replace(/<\/?[^>]+(>|$)/g, "") // remove html
  .split(/\s+/).length;

export const getSectionWordCount = (defaultTranslation: TranslationContent | undefined): Record<string, number> => {
  const sections = keys(defaultTranslation);
  const wordsCount: Record<string, number> = {};
  for (const section of sections) {
    wordsCount[section] = countWords(get(defaultTranslation, section));
  }
  return wordsCount;
}

type TranslationType = (DeepPartialSkipArrayKey<TranslateForm> | GetTraductionsForReview)[]
/**
 * Is one translation in the array validated/translated?
 */
const isTradDone = (
  section: string,
  translations: TranslationType
): boolean => {
  return !!translations.find(t => {
    return !!get(t.translated, section)
      && !(t.toFinish || [])?.includes(section)
      && !(t.toReview || [])?.includes(section)
  });
}

/**
 * Is one accordion in the array completely validated/translated?
 */
const isAccordionTranslated = (
  translations: TranslationType | undefined,
  section: "why" | "how" | "next",
  defaultTranslation: InfoSections | undefined
): boolean => {
  if (!translations) return false;

  const sectionKeys = keys({ content: { [section]: defaultTranslation } });
  // if one part of the accordion is not done by anyone, return false
  for (const s of sectionKeys) {
    if (!isTradDone(s, translations)) return false;
  }
  return true;
}

export const getMaxStepsTranslate = (defaultTranslation: TranslationContent | undefined) => {
  if (!defaultTranslation) return 0;
  const removeTitreMarque = defaultTranslation.content.titreMarque === "" ? 1 : 0;
  return Object.keys(defaultTranslation.content).length - removeTitreMarque;
}

export const getWordsCount = (
  sectionWordsCount: Record<string, number>,
  values: DeepPartialSkipArrayKey<TranslateForm>,
  suggestions: GetTraductionsForReview[],
  onlyMine: boolean
): { done: number, total: number } => {
  let done = 0;
  let total = 0;
  for (const [section, count] of Object.entries(sectionWordsCount)) {
    total += count;

    // increment if
    if (isTradDone(section, [values]) // my text is done
      || (!onlyMine && isTradDone(section, suggestions)) // someone has done this text
    ) {
      done += count;
    }
  }
  return { done, total }
}

/**
  * if expert, get steps not validated by me
  * if traductor, get steps not validated by anyone
 */
export const getMissingStepsTranslate = (
  formValue: DeepPartialSkipArrayKey<TranslateForm>,
  suggestions: GetTraductionsForReview[],
  typeContenu: ContentType,
  defaultTranslation: TranslationContent | undefined,
  isExpert: boolean
): Step[] => {
  let content: TranslationType = isExpert ? [formValue] : [
    formValue,
    ...suggestions
  ];

  const steps = [
    isTradDone("content.titreInformatif", content) ? null : "titreInformatif",
    !isTradDone("content.titreMarque", content) && typeContenu === ContentType.DISPOSITIF ? "titreMarque" : null,
    isTradDone("content.what", content) ? null : "what",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionTranslated(content, "why", (defaultTranslation?.content as DispositifContent).why) ? null : "why" :
      isAccordionTranslated(content, "how", (defaultTranslation?.content as DispositifContent).how) ? null : "how",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionTranslated(content, "how", (defaultTranslation?.content as DemarcheContent).how) ? null : "how" :
      isAccordionTranslated(content, "next", (defaultTranslation?.content as DemarcheContent).next) ? null : "next",
    isTradDone("content.abstract", content) ? null : "abstract",
  ];

  return steps.filter(s => s !== null) as Step[];
}

export const getPendingStepsTranslate = (
  translation: DeepPartialSkipArrayKey<TranslateForm>,
  key: "toReview" | "toFinish"
): Step[] => {
  const steps = translation[key];
  if (!steps) return [];
  const pendingSteps: Step[] = [];
  for (const step of steps) {
    if (step.includes(".why.")) pendingSteps.push("why");
    else if (step.includes(".how.")) pendingSteps.push("how");
    else if (step.includes(".next.")) pendingSteps.push("next");
    else pendingSteps.push(step.replace("content.", "") as Step);
  }
  return [...new Set(pendingSteps)];
}

/**
 * if expert, get count validated by me
 * if trad, get count translated by anyone
 */
export const calculateProgressTranslate = (
  translation: DeepPartialSkipArrayKey<TranslateForm>,
  suggestions: GetTraductionsForReview[],
  typeContenu: ContentType,
  defaultTranslation: TranslationContent | undefined,
  isExpert: boolean
) => {
  const missingSteps = getMissingStepsTranslate(
    translation,
    suggestions,
    typeContenu,
    defaultTranslation,
    isExpert
  );
  const max = getMaxStepsTranslate(defaultTranslation);
  return max - missingSteps.length;

}

