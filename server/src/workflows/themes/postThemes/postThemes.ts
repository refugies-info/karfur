import logger from "../../../logger";
import { Picture, ResponseWithData, ThemeColors, TranslatedText } from "../../../types/interface";
import { createTheme } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { getAllAppUsers, updateNotificationsSettings } from "../../../modules/appusers/appusers.repository";
import map from "lodash/fp/map";
import { AppUser, Theme as ThemeDB } from "../../../typegoose";
import { ThemeParams } from "../../../controllers/themeController";

export interface Theme {
  _id: string;
  name: TranslatedText;
  short: TranslatedText;
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  active: boolean;
  adminComments?: string;
}

export const hasOneNotificationEnabled = (user: AppUser) =>
  user.notificationsSettings.demarches ||
  user.notificationsSettings.global ||
  user.notificationsSettings.local ||
  Object.values(user.notificationsSettings.themes).reduce((acc, cur) => acc || cur, false);

export const addThemeInNotificationSettingsForUser = (theme: ThemeDB) => (user: AppUser) =>
  updateNotificationsSettings(user.uid, {
    ...user.notificationsSettings,
    themes: { ...user.notificationsSettings.themes, [`${theme._id}`]: hasOneNotificationEnabled(user) }
  });

const updateUsersNotificationsSettings = async (theme: ThemeDB) =>
  getAllAppUsers().then(map(addThemeInNotificationSettingsForUser(theme)));


export const postThemes = async (theme: ThemeParams): ResponseWithData<Theme> => {
  logger.info("[postThemes] received", theme);

  const dbTheme = await createTheme(theme);
  const activeLanguages = await getActiveLanguagesFromDB();

  await updateUsersNotificationsSettings(dbTheme);

  return {
    text: "success",
    data: { ...dbTheme.toObject(), active: dbTheme.isActive(activeLanguages) }
  }
};

