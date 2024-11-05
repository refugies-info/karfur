import { GetNotificationResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { getNotificationsForUser } from "~/modules/notifications/notifications.service";
import { ResponseWithData } from "~/types/interface";

export const getNotifications = async (appUid: string): ResponseWithData<GetNotificationResponse> => {
  logger.info("[getNotifications] received");

  const notifications = await getNotificationsForUser(appUid as string);
  const unseenCount = notifications.filter((notif) => !notif.seen).length;

  return {
    text: "success",
    data: {
      unseenCount,
      notifications,
    },
  };
};
