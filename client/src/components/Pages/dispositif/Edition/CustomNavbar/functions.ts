import { ContentType, GetDispositifResponse, InfoSections } from "api-types";

export const getText = (progress: number) => {
  if (progress === 0) return "C'est parti lancez-vous !";
  if (progress <= 3) return "Vous êtes sur la bonne voie !";
  if (progress <= 6) return "Presqu’à la moitié";
  if (progress <= 9) return "Continuez comme ça !";
  if (progress <= 13) return "Vous y êtes presque !";
  return "Bravo, tout est bon ! 🎉";
};

const isAccordionOk = (content: InfoSections | undefined) => {
  if (!content) return false;
  return content && Object.keys(content).length >= 3 && !Object.values(content).find(c => !c.title || !c.text)
}

const isMetadataOk = (content: any | any[]) => {
  if (Array.isArray(content)) { // if multiple metas in sections, none should be undefined
    return content.filter(c => c === undefined).length === 0
  }
  return content || content === null // ok if filled or null
}

export const calculateProgress = (dispositif: Partial<GetDispositifResponse>) => {
  const conditions: boolean[] = [
    !!dispositif.titreInformatif,
    !!dispositif.titreMarque,
    !!dispositif.what,
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk(dispositif.why) : isAccordionOk(dispositif.how),
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk(dispositif.how) : isAccordionOk(dispositif.next),
    !!dispositif.abstract,
    !!dispositif.theme,
    (dispositif.sponsors?.length || 0) > 0,
    dispositif.mainSponsor,
    isMetadataOk([
      dispositif.metadatas?.publicStatus,
      dispositif.metadatas?.age,
      dispositif.metadatas?.frenchLevel,
      dispositif.metadatas?.public,
    ]),
    isMetadataOk(dispositif.metadatas?.price),
    isMetadataOk([
      dispositif.metadatas?.commitment,
      dispositif.metadatas?.frequency,
      dispositif.metadatas?.timeSlots,
    ]),
    isMetadataOk(dispositif.metadatas?.conditions),
    isMetadataOk(dispositif.metadatas?.location)
  ];
  return conditions.filter(c => c).length;
}
