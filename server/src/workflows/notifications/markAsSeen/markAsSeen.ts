import { MarkAsSeenRequest } from "../../../controllers/notificationsController";
import { Response } from "../../../types/interface";
import logger from "../../../logger";
import { markNotificationAsSeen } from "../../../modules/notifications/notifications.service";

export const markAsSeen = async (appUid: string, body: MarkAsSeenRequest): Response => {
  logger.info("[markAsSeen] received");

  const success = await markNotificationAsSeen(body.notificationId, appUid);
  if (!success) throw new Error("Unexpected error")

  return { text: "success" }
};

