import { AppUserModel } from "../../../typegoose";
import logger from "../../../logger";
import { deleteThemeById } from "../../../modules/themes/themes.repository";
import { Response } from "../../../types/interface";

export const deleteTheme = async (id: string): Promise<Response> => {
  logger.info("[deleteTheme] received", id);

  await deleteThemeById(id);
  await AppUserModel.updateMany({}, { $unset: { [`notificationsSettings.themes.${id}`]: 1 } });

  return { text: "success" };
};

