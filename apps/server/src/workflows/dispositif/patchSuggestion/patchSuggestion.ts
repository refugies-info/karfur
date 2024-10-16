import { ReadSuggestionDispositifRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { modifyReadSuggestionInDispositif } from "~/modules/dispositif/dispositif.repository";
import { Response } from "~/types/interface";

export const patchSuggestion = async (id: string, body: ReadSuggestionDispositifRequest): Response => {
  logger.info("[patchSuggestion] received", { id, body });
  await modifyReadSuggestionInDispositif(id, body.suggestionId);
  return { text: "success" };
};
