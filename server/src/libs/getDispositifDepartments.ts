import { DispositifDoc } from "../schema/schemaDispositif";

export const getDispositifDepartments = (
  dispositif: DispositifDoc
) => {
  //@ts-ignore
  const infocards = (dispositif.contenu?.[1]?.children || []).find(card => card.title === "Zone d'action");
  if (!infocards) return [];
  return infocards.departments || [];
};
