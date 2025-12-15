import { DispositifStatus } from "@refugies-info/api-types";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import {
  getDispositifById,
  removeAvisDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import type { Response } from "~/types/interface";

export const deleteAvis = async (
  id: string,
  userId: string | undefined,
  anonymousUserId: string | undefined,
): Response => {
  logger.info("[deleteAvis] received", id);
  const dispositif = await getDispositifById(id, { status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  await removeAvisDispositifInDB(id, userId, anonymousUserId);

  return { text: "success" };
};
