import { AppUserModel } from "@refugies-info/mongo";
import logger from "~/logger";
import { deleteThemeById } from "~/modules/themes/themes.repository";
import type { Response } from "~/types/interface";

export const deleteTheme = async (id: string): Response => {
  logger.info("[deleteTheme] received", id);

  await deleteThemeById(id);
  await AppUserModel.updateMany({}, { $unset: { [`notificationsSettings.themes.${id}`]: 1 } });

  return { text: "success" };
};
