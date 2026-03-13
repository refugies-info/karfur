import { DispositifStatus } from "@refugies-info/api-types";
import type { UserId } from "@refugies-info/mongo";
import logger from "~/logger";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (id: string, authorId: UserId) => {
  try {
    await addLog(id, "Dispositif", "Statut modifié : " + DispositifStatus.DELETED, {
      author: authorId,
    });
  } catch (e) {
    logger.error("[deleteDispositif] error while logging", e);
  }
};
