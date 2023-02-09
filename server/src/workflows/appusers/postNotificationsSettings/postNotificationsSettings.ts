import { ResponseWithData } from "../../../types/interface";
import { NotificationSettingsRequest } from "../../../controllers/appusersController";
import { NotFoundError } from "../../../errors";
import logger from "../../../logger";
import { updateNotificationsSettings } from "../../../modules/appusers/appusers.repository";

export interface PostNotificationsSettings {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
}

export const postNotificationsSettings = async (appUid: string, body: NotificationSettingsRequest): ResponseWithData<PostNotificationsSettings> => {
  logger.info("[updateNotificationsSettings] received");

  const settings = await updateNotificationsSettings(appUid, body);
  if (!settings) throw new NotFoundError("Settings not found");

  return {
    text: "success",
    data: settings
  }
};

