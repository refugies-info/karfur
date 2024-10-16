import { NotificationSettingsRequest, PostNotificationsSettingsResponse } from "@refugies-info/api-types";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { updateNotificationsSettings } from "~/modules/appusers/appusers.repository";
import { ResponseWithData } from "~/types/interface";

export const postNotificationsSettings = async (
  appUid: string,
  body: NotificationSettingsRequest,
): ResponseWithData<PostNotificationsSettingsResponse> => {
  logger.info("[updateNotificationsSettings] received");

  const settings = await updateNotificationsSettings(appUid, body);
  if (!settings) throw new NotFoundError("Settings not found");

  return {
    text: "success",
    data: settings,
  };
};
