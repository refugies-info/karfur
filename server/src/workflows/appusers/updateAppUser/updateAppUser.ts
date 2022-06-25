import { AppUser, AppUserType } from "../../../schema/schemaAppUser";

export const updateAppUser = async (payload: AppUserType) => {
  const appUser = await AppUser.findOne({ uid: payload.uid });

  if (appUser) {
    return AppUser.updateOne({ uid: payload.uid }, payload, { upsert: true, new: true });
  }
  return AppUser.create(payload);
};
