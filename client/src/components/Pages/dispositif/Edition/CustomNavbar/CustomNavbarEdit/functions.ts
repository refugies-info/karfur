import { DeepPartialSkipArrayKey } from "react-hook-form";
import { ContentType, CreateDispositifRequest, InfoSections } from "api-types";

export const getText = (progress: number, total: number) => {
  const progressPercentage = progress / (total || 1);
  if (progress === 0) return "C'est parti lancez-vous !";
  if (progressPercentage <= 0.25) return "Vous êtes sur la bonne voie !";
  if (progressPercentage <= 0.5) return "Presqu’à la moitié";
  if (progressPercentage <= 0.75) return "Continuez comme ça !";
  if (progressPercentage < 1) return "Vous y êtes presque !";
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
export type Step = "titreInformatif" | "titreMarque" | "what" | "why" | "how" | "how" | "next" | "abstract" | "theme" | "sponsors" | "mainSponsor" | "public" | "price" | "commitment" | "conditions" | "location";
/**
 * return an array with null if complete, or the name of the step if missing
 */
export const getMissingStepsEdit = (dispositif: DeepPartialSkipArrayKey<CreateDispositifRequest>, typeContenu: ContentType): (Step | null)[] => {
  if (typeContenu === ContentType.DISPOSITIF) {
    return [
      !!dispositif.titreInformatif ? null : "titreInformatif",
      !!dispositif.titreMarque ? null : "titreMarque",
      !!dispositif.what ? null : "what",
      isAccordionOk(dispositif.why, 3) ? null : "why",
      isAccordionOk(dispositif.how, 1) ? null : "how",
      !!dispositif.theme ? null : "theme",
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
      isMetadataOk(dispositif.metadatas?.location) ? null : "location",
      dispositif.mainSponsor ? null : "mainSponsor",
      !!dispositif.abstract ? null : "abstract"
    ];
  }

  return [
    !!dispositif.titreInformatif ? null : "titreInformatif",
    !!dispositif.what ? null : "what",
    isAccordionOk(dispositif.how, 1) ? null : "how",
    isAccordionOk(dispositif.next, 1) ? null : "next",
    !!dispositif.theme ? null : "theme",
    isMetadataOk([
      dispositif.metadatas?.publicStatus,
      dispositif.metadatas?.age,
      dispositif.metadatas?.frenchLevel,
      dispositif.metadatas?.public,
    ]) ? null : "public",
    isMetadataOk(dispositif.metadatas?.price) ? null : "price",
    isMetadataOk(dispositif.metadatas?.conditions) ? null : "conditions",
    dispositif.mainSponsor ? null : "mainSponsor",
    !!dispositif.abstract ? null : "abstract",
  ];
}

export const getTotalSteps = (typeContenu: ContentType) => {
  return getMissingStepsEdit({}, typeContenu).length;
}

export const calculateProgressEdit = (dispositif: DeepPartialSkipArrayKey<CreateDispositifRequest>, typeContenu: ContentType) => {
  return getMissingStepsEdit(dispositif, typeContenu).filter(c => c === null).length;
}
