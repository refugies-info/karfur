import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";

export const log = async (
  demarcheId: ObjectId,
  authorId: ObjectId
) => {
  try {
    await addLog(
      demarcheId,
      "Dispositif",
      "Notification push envoyée",
      { author: authorId }
    );
  } catch (e) {
    logger.error("[sendNotifications] error while logging", e);
  }
}
