import logger from "~/logger";
import { deleteThemeById } from "~/modules/themes/themes.repository";
import { AppUserModel } from "~/typegoose";
import { Response } from "~/types/interface";

export const deleteTheme = async (id: string): Response => {
  logger.info("[deleteTheme] received", id);

  await deleteThemeById(id);
  await AppUserModel.updateMany({}, { $unset: { [`notificationsSettings.themes.${id}`]: 1 } });

  return { text: "success" };
};
