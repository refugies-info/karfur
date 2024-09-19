import { DemarcheContent, DispositifContent, InfoSection, InfoSections } from "@refugies-info/api-types";
import get from "lodash/get";
import isString from "lodash/isString";
import { TranslationContent } from "~/typegoose/Dispositif";

/**
 * Basic word counter
 *
 * @todo
 * @param str string
 * @returns number of words
 */
export const countWords = (str?: string): number =>
  isString(str)
    ? str
        .replace(/<\/?[^>]+(>|$)/g, "")
        .split(/\s+/)
        .filter((w) => !!w).length
    : 0;

export const countWordsForInfoSections = (infoSections: InfoSections): number =>
  Object.values(infoSections || {}).reduce(
    (acc, { title, text }: InfoSection) => acc + countWords(title) + countWords(text),
    0,
  );

export const countDispositifWords = (translation: DispositifContent | DemarcheContent) => {
  return (
    countWords(translation.titreInformatif) +
    countWords(translation.titreMarque) +
    countWords(translation.abstract) +
    countWords(translation.what) +
    countWordsForInfoSections(translation.how) +
    countWordsForInfoSections((translation as DemarcheContent).next) +
    countWordsForInfoSections((translation as DispositifContent).why)
  );
};

export const countDispositifWordsForSections = (translation: TranslationContent, sections: string[]) => {
  return sections.reduce((acc, key: string) => acc + countWords(get(translation, key) || ""), 0);
};
