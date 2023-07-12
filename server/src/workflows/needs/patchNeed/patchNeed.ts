import { Response } from "../../../types/interface";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import logger from "../../../logger";
import { Need, User } from "../../../typegoose";
import { UnauthorizedError } from "../../../errors";
import { NeedRequest } from "@refugies-info/api-types";

export const patchNeed = async (id: string, body: Partial<NeedRequest>, user: User): Response => {
  logger.info("[saveNeed] received", id);
  const oldNeed = await getNeedFromDB(id);
  const need: Partial<Need> = { ...body };

  if (!user.isAdmin() && (body.adminComments || body.fr || body.theme || body.image)) {
    throw new UnauthorizedError("Only admins can edit a need");
  }

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
