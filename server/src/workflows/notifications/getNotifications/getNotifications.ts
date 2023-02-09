import { ResponseWithData } from "src/types/interface";
import logger from "../../../logger";

import { getNotificationsForUser } from "../../../modules/notifications/notifications.service";

export interface GetNotificationResponse {
  unseenCount: number;
  notifications: {
    uid: string;
    seen: boolean;
    title: string;
    data: any;
  }[]
}

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

