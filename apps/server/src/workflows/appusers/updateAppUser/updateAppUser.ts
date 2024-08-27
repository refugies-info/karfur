import { AppUserRequest, PostAppUserResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { updateOrCreateAppUser } from "~/modules/appusers/appusers.repository";
import { getAllThemes } from "~/modules/themes/themes.repository";
import { ResponseWithData } from "~/types/interface";

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
