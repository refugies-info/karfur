import { Response } from "../../../types/interface";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import logger from "../../../logger";
import { Need } from "../../../typegoose";
import { NeedRequest } from "@refugies-info/api-types";

export const patchNeed = async (id: string, body: Partial<NeedRequest>): Response => {
  logger.info("[saveNeed] received", id);
  const oldNeed = await getNeedFromDB(id);
  const need: Partial<Need> = { ...body };

  // edit french version
  if (need.fr) {
    const isFrenchTextEdited =
      (need.fr.text && need.fr.text !== oldNeed.fr.text) ||
      (need.fr.subtitle && need.fr.subtitle !== oldNeed.fr.subtitle);
    need.fr.updatedAt = isFrenchTextEdited ? new Date() : oldNeed.fr.updatedAt;
  }

  await saveNeedInDB(id, need);

  return { text: "success" };
};
