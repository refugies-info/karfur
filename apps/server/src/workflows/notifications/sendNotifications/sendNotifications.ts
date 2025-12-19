import type { SendNotificationsRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { sendDemarcheNotifications } from "~/modules/notifications/notifications.service";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const sendNotifications = async (
  body: SendNotificationsRequest,
  userId: string,
): Response => {
  logger.info("[sendNotifications] received");

  await sendDemarcheNotifications(body.demarcheId);
  await log(body.demarcheId, userId);

  return { text: "success" };
};
