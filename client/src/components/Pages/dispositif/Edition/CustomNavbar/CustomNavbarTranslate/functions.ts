import { ContentType, DemarcheContent, DispositifContent, InfoSections, TranslationContent } from "api-types";
import { TranslateForm } from "hooks/dispositif/useDispositifTranslateForm";
import { DeepPartialSkipArrayKey } from "react-hook-form";

export type Step = "titreInformatif" | "titreMarque" | "what" | "why" | "how" | "how" | "next" | "abstract";

const isAccordionTranslated = (
  content: DeepPartialSkipArrayKey<InfoSections> | undefined,
  defaultTranslation: InfoSections | undefined
) => {
  if (!content || !defaultTranslation) return false;
  return content && Object.keys(content).length === Object.keys(defaultTranslation).length && !Object.values(content).find(c => !c || !c.title || !c.text)
}
export const getMaxStepsTranslate = (defaultTranslation: TranslationContent | undefined) => {
  if (!defaultTranslation) return 0;
  return Object.keys(defaultTranslation.content).length;
}
/**
 * return an array with null if complete, or the name of the step if missing
 */
export const getMissingStepsTranslate = (
  translation: DeepPartialSkipArrayKey<TranslateForm>,
  typeContenu: ContentType,
  defaultTranslation: TranslationContent | undefined
): (Step | null)[] => {
  const content = translation.translated?.content;
  return [
    !!content?.titreInformatif ? null : "titreInformatif",
    !content?.titreMarque && typeContenu === ContentType.DISPOSITIF ? "titreMarque" : null,
    !!content?.what ? null : "what",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionTranslated(content?.why, (defaultTranslation?.content as DispositifContent).why) ? null : "why" :
      isAccordionTranslated(content?.how, (defaultTranslation?.content as DispositifContent).how) ? null : "how",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionTranslated(content?.how, (defaultTranslation?.content as DemarcheContent).how) ? null : "how" :
      isAccordionTranslated(content?.next, (defaultTranslation?.content as DemarcheContent).next) ? null : "next",
    !!content?.abstract ? null : "abstract",
  ];
}

export const calculateProgressTranslate = (
  translation: DeepPartialSkipArrayKey<TranslateForm>,
  typeContenu: ContentType,
  defaultTranslation: TranslationContent | undefined
) => {
  return getMissingStepsTranslate(translation, typeContenu, defaultTranslation).filter(c => c === null).length;
}
