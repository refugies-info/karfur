import { ResponseWithData } from "../../../types/interface";
import { NotFoundError } from "../../../errors";
import logger from "../../../logger";
import { getNotificationsSettings as getSettings } from "../../../modules/appusers/appusers.repository";

export interface GetNotificationsSettings {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
}

export const getNotificationsSettings = async (appUid: string): ResponseWithData<GetNotificationsSettings> => {
  logger.info("[getNotificationsSettings] received");
  const settings = await getSettings(appUid);
  if (!settings) throw new NotFoundError("Settings not found");

  return {
    text: "success",
    data: settings
  }
};

