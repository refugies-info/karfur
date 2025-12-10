import type { AddSuggestionDispositifRequest } from "@refugies-info/api-types";
import type { DemarcheContent, DispositifContent, Suggestion } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import uniqid from "uniqid";
import logger from "~/logger";
import {
  addSuggestionDispositifInDB,
  getDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const addSuggestion = async (
  id: string,
  body: AddSuggestionDispositifRequest,
  userId: string | null,
): Response => {
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
