import { DeepPartialSkipArrayKey } from "react-hook-form";
import { ContentType, CreateDispositifRequest, InfoSections } from "api-types";

export const getText = (progress: number) => {
  if (progress === 0) return "C'est parti lancez-vous !";
  if (progress <= 3) return "Vous êtes sur la bonne voie !";
  if (progress <= 6) return "Presqu’à la moitié";
  if (progress <= 9) return "Continuez comme ça !";
  if (progress <= 12) return "Vous y êtes presque !";
  return "Bravo, tout est bon ! 🎉";
};

const isAccordionOk = (content: DeepPartialSkipArrayKey<InfoSections> | undefined, minAccordions: number) => {
  if (!content) return false;
  return content && Object.keys(content).length >= minAccordions && !Object.values(content).find(c => !c || !c.title || !c.text)
}

const isMetadataOk = (content: any | any[]) => {
  if (Array.isArray(content)) { // if multiple metas in sections, none should be undefined
    return content.filter(c => c === undefined).length === 0
  }
  return content || content === null // ok if filled or null
}

export const TOTAL_STEPS = 13;

export type Step = "titreInformatif" | "titreMarque" | "what" | "why" | "how" | "how" | "next" | "abstract" | "theme" | "sponsors" | "mainSponsor" | "public" | "price" | "commitment" | "conditions" | "location";
/**
 * return an array with null if complete, or the name of the step if missing
 */
export const getMissingSteps = (dispositif: DeepPartialSkipArrayKey<CreateDispositifRequest>, typeContenu: ContentType): (Step | null)[] => {
  /* TODO: translate keys */
  return [
    !!dispositif.titreInformatif ? null : "titreInformatif",
    !!dispositif.titreMarque ? null : "titreMarque",
    !!dispositif.what ? null : "what",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionOk(dispositif.why, 3) ? null : "why" :
      isAccordionOk(dispositif.how, 3) ? null : "how",
    typeContenu === ContentType.DISPOSITIF ?
      isAccordionOk(dispositif.how, 1) ? null : "how" :
      isAccordionOk(dispositif.next, 1) ? null : "next",
    !!dispositif.abstract ? null : "abstract",
    !!dispositif.theme ? null : "theme",
    dispositif.mainSponsor ? null : "mainSponsor",
    isMetadataOk([
      dispositif.metadatas?.publicStatus,
      dispositif.metadatas?.age,
      dispositif.metadatas?.frenchLevel,
      dispositif.metadatas?.public,
    ]) ? null : "public",
    isMetadataOk(dispositif.metadatas?.price) ? null : "price",
    isMetadataOk([
      dispositif.metadatas?.commitment,
      dispositif.metadatas?.frequency,
      dispositif.metadatas?.timeSlots,
    ]) ? null : "commitment",
    isMetadataOk(dispositif.metadatas?.conditions) ? null : "conditions",
    isMetadataOk(dispositif.metadatas?.location) ? null : "location"
  ];
}

export const calculateProgress = (dispositif: DeepPartialSkipArrayKey<CreateDispositifRequest>, typeContenu: ContentType) => {
  return getMissingSteps(dispositif, typeContenu).filter(c => c === null).length;
}
