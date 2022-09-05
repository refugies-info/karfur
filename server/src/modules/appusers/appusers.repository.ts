import { AppUser, AppUserType, NotificationsSettings } from "../../schema/schemaAppUser";

export const getAllAppUsers = async () => {
  return await AppUser.find();
};

export const getNotificationsSettings = async (uid: string) => {
  const appUser = await AppUser.findOne({ uid });
  if (!appUser) {
    return null;
  }
  return appUser.notificationsSettings;
};

export const updateNotificationsSettings = async (uid: string, payload: Partial<NotificationsSettings>) => {
  const appUser = await AppUser.findOne({ uid });
  if (!appUser) {
    return null;
  }
  if (payload.themes) {
    const themes = { ...appUser.notificationsSettings.themes, ...payload.themes };
    appUser.notificationsSettings = {
      ...appUser.notificationsSettings,
      themes
    };
  } else {
    appUser.notificationsSettings = { ...appUser.notificationsSettings, ...payload };
  }
  await appUser.save();
  return appUser.notificationsSettings;
};

export const updateOrCreateAppUser = async (payload: AppUserType, themeIds: string[]) => {
  const appUser = await AppUser.findOne({ uid: payload.uid });

  if (appUser) {
    return AppUser.updateOne({ uid: payload.uid }, payload, { upsert: true, new: true });
  }

  const themes: Record<string, boolean> = {};
  for (const themeId of themeIds) {
    themes[themeId] = true
  }
  return AppUser.create({
    ...payload,
    notificationsSettings: {
      global: true,
      local: true,
      demarches: true,
      themes: themes
    }
  });
};
