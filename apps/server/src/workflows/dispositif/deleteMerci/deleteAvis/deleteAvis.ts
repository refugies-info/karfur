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
  userId: string | null,
  anonymousUserId: string | null,
): Response => {
  logger.info("[deleteAvis] received", id);
  const dispositif = await getDispositifById(id, { status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  try {
    await removeAvisDispositifInDB(id, userId, anonymousUserId);
    logger.info("[deleteAvis] deleted", id);
    return { text: "success" };
  } catch (error) {
    logger.error("[deleteAvis] Error deleting feedback", error);
    return { text: "error" };
  }
};
