import { GetNotificationResponse } from "api-types";
import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getNotificationsForUser } from "../../../modules/notifications/notifications.service";

export const getNotifications = async (appUid: string): ResponseWithData<GetNotificationResponse> => {
  logger.info("[getNotifications] received");

  const notifications = await getNotificationsForUser(appUid as string);
  const unseenCount = notifications.filter((notif) => !notif.seen).length;

  return ({
    text: "success",
    data: {
      unseenCount,
      notifications
    }
  });
};

