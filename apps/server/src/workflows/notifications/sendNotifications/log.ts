import type { DispositifId, UserId } from "@refugies-info/mongo";
import logger from "~/logger";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (demarcheId: DispositifId, authorId: UserId) => {
  try {
    await addLog(demarcheId, "Dispositif", "Notification push envoyée", { author: authorId });
  } catch (e) {
    logger.error("[sendNotifications] error while logging", e);
  }
};
