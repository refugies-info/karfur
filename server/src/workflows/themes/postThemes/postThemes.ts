import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { createTheme } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { getAllAppUsers, updateNotificationsSettings } from "../../../modules/appusers/appusers.repository";
import { map } from "lodash/fp";
import { AppUser, Theme as ThemeDB } from "src/typegoose";
import { ThemeParams } from "src/controllers/themeController";

interface Image {
  secure_url: string;
  public_id: string;
  imgId: string;
}

export interface Theme {
  _id: string;
  name: Record<string, string>;
  short: Record<string, string>;
  colors: {
    color100: string;
    color80: string;
    color60: string;
    color40: string;
    color30: string;
  };
  position: number;
  icon: Image;
  banner: Image;
  appBanner: Image;
  appImage: Image;
  shareImage: Image;
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


export const postThemes = async (theme: ThemeParams): Promise<ResponseWithData<Theme>> => {
  logger.info("[postThemes] received", theme);
  // checkRequestIsFromSite(req.fromSite);

  const dbTheme = await createTheme(theme);
  const activeLanguages = await getActiveLanguagesFromDB();

  await updateUsersNotificationsSettings(dbTheme);

  return {
    text: "success",
    data: { ...dbTheme.toObject(), active: dbTheme.isActive(activeLanguages) }
  }
};

