import { PostThemeResponse, ThemeRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { getAllAppUsers, updateNotificationsSettings } from "~/modules/appusers/appusers.repository";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { createTheme } from "~/modules/themes/themes.repository";
import { AppUser, Theme } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const hasOneNotificationEnabled = (user: AppUser) =>
  user.notificationsSettings.demarches ||
  user.notificationsSettings.global ||
  user.notificationsSettings.local ||
  Object.values(user.notificationsSettings.themes).reduce((acc, cur) => acc || cur, false);

export const addThemeInNotificationSettingsForUser = (theme: Theme) => (user: AppUser) =>
  updateNotificationsSettings(user.uid, {
    ...user.notificationsSettings,
    themes: { ...user.notificationsSettings.themes, [`${theme._id}`]: hasOneNotificationEnabled(user) },
  });

const updateUsersNotificationsSettings = async (theme: Theme) => {
  const appUsers = await getAllAppUsers();
  // TODO: use a batch update (see https://github.com/refugies-info/karfur/issues/2166)
  return Promise.all(appUsers.map(addThemeInNotificationSettingsForUser(theme)));
};

export const postThemes = async (theme: ThemeRequest): ResponseWithData<PostThemeResponse> => {
  logger.info("[postThemes] received", theme);

  const dbTheme = await createTheme(theme);
  const activeLanguages = await getActiveLanguagesFromDB();

  await updateUsersNotificationsSettings(dbTheme);

  return {
    text: "success",
    data: { ...dbTheme.toObject(), active: dbTheme.isActive(activeLanguages) },
  };
};
