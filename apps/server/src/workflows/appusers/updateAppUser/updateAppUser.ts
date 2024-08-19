import { getAllThemes } from "../../../modules/themes/themes.repository";
import { updateOrCreateAppUser } from "../../../modules/appusers/appusers.repository";
import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { AppUserRequest, PostAppUserResponse } from "@refugies-info/api-types";

export const updateAppUser = async (appUid: string, body: AppUserRequest): ResponseWithData<PostAppUserResponse> => {
  logger.info("[updateAppUser] received");

  const themes = await getAllThemes();
  const updated = await updateOrCreateAppUser(
    {
      ...body,
      uid: appUid,
    },
    themes.map((t) => t.id),
  );

  return {
    text: "success",
    data: updated,
  };
};
