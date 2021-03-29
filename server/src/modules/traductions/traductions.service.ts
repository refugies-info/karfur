import { TraductionDoc } from "../../schema/schemaTraduction";

export const getTradStatus = (tradArray: TraductionDoc[]) => {
  const isPublished = !!tradArray.find((trad) => trad.status === "Validée");
  if (isPublished) return "Validée";

  const isARevoir = !!tradArray.find((trad) => trad.status === "À revoir");
  if (isARevoir) return "À revoir";

  const isEnAttente = !!tradArray.find((trad) => trad.status === "En attente");
  if (isEnAttente) return "En attente";

  return "À traduire";
};
