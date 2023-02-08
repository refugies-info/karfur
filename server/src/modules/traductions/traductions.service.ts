import { Dispositif, Traductions } from "src/typegoose";
import { TraductionsStatus } from "src/typegoose/Traductions";

export const getTradStatus = (dispositif: Dispositif, tradArray: Traductions[]) => {
  const isPublished = !!tradArray.find((trad) => trad.status === TraductionsStatus.VALIDATED);
  if (isPublished) return "Validée";

  const isARevoir = !!tradArray.find((trad) => trad.status === TraductionsStatus.TO_REVIEW);
  if (isARevoir) return "À revoir";

  const isEnAttente = !!tradArray.find((trad) => trad.status === TraductionsStatus.PENDING);
  if (isEnAttente) return "En attente";

  return "À traduire";
};
