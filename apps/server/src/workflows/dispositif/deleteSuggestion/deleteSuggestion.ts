import { deleteSuggestionDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import logger from "../../../logger";
import { Response } from "../../../types/interface";

export const deleteSuggestion = async (id: string, suggestionId: string): Response => {
  logger.info("[deleteSuggestion] received", { id, suggestionId });
  await deleteSuggestionDispositifInDB(id, suggestionId);
  return { text: "success" };
};

