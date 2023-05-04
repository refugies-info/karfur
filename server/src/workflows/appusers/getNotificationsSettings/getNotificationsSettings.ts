import { ResponseWithData } from "../../../types/interface";
import { NotFoundError } from "../../../errors";
import logger from "../../../logger";
import { getNotificationsSettings as getSettings } from "../../../modules/appusers/appusers.repository";
import { GetNotificationsSettingsResponse } from "@refugies-info/api-types";

export const getNotificationsSettings = async (appUid: string): ResponseWithData<GetNotificationsSettingsResponse> => {
  logger.info("[getNotificationsSettings] received");
  const settings = await getSettings(appUid);
  if (!settings) throw new NotFoundError("Settings not found");

  return {
    text: "success",
    data: settings,
  };
};
