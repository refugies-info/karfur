import logger from "../../../logger";
import { log } from "./log";
import { sendNotificationsForDemarche } from "../../../modules/notifications/notifications.service";
import { Response } from "../../../types/interface";
import { SendNotificationsRequest } from "@refugies-info/api-types";

export const sendNotifications = async (body: SendNotificationsRequest, userId: string): Response => {
  logger.info("[sendNotifications] received");

  await sendNotificationsForDemarche(body.demarcheId);
  await log(body.demarcheId, userId);

  return { text: "success" };
};
