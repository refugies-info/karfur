import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";
import { DispositifId, UserId } from "src/typegoose";

export const log = async (demarcheId: DispositifId, authorId: UserId) => {
  try {
    await addLog(demarcheId, "Dispositif", "Notification push envoyée", { author: authorId });
  } catch (e) {
    logger.error("[sendNotifications] error while logging", e);
  }
};
