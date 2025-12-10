import {
  type AppUser,
  AppUserModel,
  type AppUserType,
  type NotificationsSettings,
} from "~/typegoose";

export const getAllAppUsers = async () => AppUserModel.find();

export const getAppUsersBatch = async (skip: number, batchSize: number) =>
  AppUserModel.find().skip(skip).limit(batchSize);

export const processAppUsersByBatch = async (
  batchSize: number,
  processor: (users: AppUser[]) => Promise<void>,
) => {
  let skip = 0;
  for (;;) {
    const users: AppUser[] = await getAppUsersBatch(skip, batchSize);
    if (users.length === 0) break;
    await processor(users);
    skip += batchSize;
  }
};

export const getNotificationsSettings = async (uid: string) => {
  const appUser = await AppUserModel.findOne({ uid });
  if (!appUser) {
    return null;
  }
  return appUser.notificationsSettings;
};

export const updateNotificationsSettings = async (
  uid: string,
  payload: Partial<NotificationsSettings>,
) => {
  const appUser = await AppUserModel.findOne({ uid });
  if (!appUser) {
    return null;
  }
  if (payload.themes) {
    const themes = { ...appUser.notificationsSettings.themes, ...payload.themes };
    appUser.notificationsSettings = {
      ...appUser.notificationsSettings,
      themes,
    };
  } else {
    appUser.notificationsSettings = { ...appUser.notificationsSettings, ...payload };
  }
  await appUser.save();
  return appUser.notificationsSettings;
};

export const updateOrCreateAppUser = async (
  payload: Partial<AppUserType> & { uid: string },
  themeIds: string[],
) => {
  const appUser = await AppUserModel.findOne({ uid: payload.uid });

  // delete outdated appusers with the same ExpoPushToken
  await AppUserModel.deleteMany({
    uid: { $ne: payload.uid },
    expoPushToken: payload.expoPushToken,
  });

  if (appUser) {
    await AppUserModel.updateOne({ uid: payload.uid }, payload, { upsert: true });
    return AppUserModel.findOne({ uid: payload.uid }); // fix wrong type after updateOne
  }

  const themes: Record<string, boolean> = {};
  for (const themeId of themeIds) {
    themes[themeId] = true;
  }
  return AppUserModel.create({
    ...payload,
    notificationsSettings: {
      global: true,
      local: true,
      demarches: true,
      themes: themes,
    },
  });
};
