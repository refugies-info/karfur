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

export const calculateProgressTranslate = (
  translation: DeepPartialSkipArrayKey<TranslateForm>,
  typeContenu: ContentType,
  defaultTranslation: TranslationContent | undefined
) => {
  const missingSteps = getMissingStepsTranslate(translation, typeContenu, defaultTranslation);
  const max = missingSteps.length;
  const missing = [...new Set([
    ...missingSteps.filter(c => c !== null) as Step[],
    ...getPendingStepsTranslate(translation, "toFinish"),
    ...getPendingStepsTranslate(translation, "toReview"),
  ])].length;
  return max - missing;
}
