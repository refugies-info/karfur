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
  return content && Object.keys(content).length >= 2 && !Object.values(content).find(c => !c.title || !c.text)
}

const isMetadataOk = (content: any) => {
  if (content || content === null) return true
  return false
}

export const calculateProgress = (dispositif: Partial<GetDispositifResponse>) => {
  const conditions: boolean[] = [
    !!dispositif.titreInformatif,
    !!dispositif.what,
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk(dispositif.why) : isAccordionOk(dispositif.how),
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk(dispositif.how) : isAccordionOk(dispositif.next),
    !!dispositif.abstract,
    !!dispositif.theme,
    isMetadataOk(dispositif.metadatas?.price),
    isMetadataOk(dispositif.metadatas?.location)
    // TODO: continue here
  ];
  return conditions.filter(c => c).length;
}
