import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";
import { UserId } from "../../../typegoose";
import { DispositifStatus } from "@refugies-info/api-types";

export const log = async (id: string, authorId: UserId) => {
  try {
    await addLog(id, "Dispositif", "Statut modifié : " + DispositifStatus.DELETED, {
      author: authorId,
    });
  } catch (e) {
    logger.error("[addDispositif] error while logging", e);
  }
};
