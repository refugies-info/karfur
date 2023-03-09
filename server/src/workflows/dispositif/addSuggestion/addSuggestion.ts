import { AddSuggestionDispositifRequest } from "api-types";
import uniqid from "uniqid";
import { addSuggestionDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { ObjectId } from "../../../typegoose";
import { DemarcheContent, DispositifContent, Suggestion } from "../../../typegoose/Dispositif";
import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { log } from "./log";

export const addSuggestion = async (id: string, body: AddSuggestionDispositifRequest, userId: string | null): Response => {
  logger.info("[addSuggestion] received", { id, body });
  const newSuggestion: Suggestion = {
    created_at: new Date(),
    suggestionId: uniqid("feedback_"), // TODO: uuid?
    suggestion: body.suggestion,
    section: body.key as keyof DispositifContent | keyof DemarcheContent,
    read: false,
  };
  if (userId) newSuggestion.userId = new ObjectId(userId);
  await addSuggestionDispositifInDB(id, newSuggestion);

  const dispositif = await getDispositifById(id, { mainSponsor: 1 });
  await log(dispositif, id);

  return { text: "success" };
};

