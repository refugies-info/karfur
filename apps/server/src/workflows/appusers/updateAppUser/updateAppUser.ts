import type { AppUserRequest, PostAppUserResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { updateOrCreateAppUser } from "~/modules/appusers/appusers.repository";
import { getAllThemes } from "~/modules/themes/themes.repository";
import type { ResponseWithData } from "~/types/interface";

export const updateAppUser = async (
  appUid: string,
  body: AppUserRequest,
): ResponseWithData<PostAppUserResponse> => {
  logger.info("[updateAppUser] received");

  const themes = await getAllThemes();
  const updated = await updateOrCreateAppUser(
    {
      ...body,
      uid: appUid,
    },
    themes.map((t) => t._id.toString()),
  );

  return {
    text: "success",
    data: updated,
  };
};
