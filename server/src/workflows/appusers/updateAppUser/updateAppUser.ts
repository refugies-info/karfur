import { getAllThemes } from "../../../modules/themes/themes.repository";
import { updateOrCreateAppUser } from "../../../modules/appusers/appusers.repository";
import logger from "../../../logger";
import { AppUserRequest } from "../../../controllers/appusersController";
import { ResponseWithData } from "../../../types/interface";

export interface PostAppUserResponse {
  uid: string;
  city?: string;
  department?: string;
  selectedLanguage?: string;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
  notificationsSettings?: {
    global: boolean;
    local: boolean;
    demarches: boolean;
    themes: {
      [key: string]: boolean;
    }
  }
}

export const updateAppUser = async (appUid: string, body: AppUserRequest): ResponseWithData<PostAppUserResponse> => {
  logger.info("[updateAppUser] received");

  const themes = await getAllThemes();
  const updated = await updateOrCreateAppUser({
    ...body,
    uid: appUid
  }, themes.map(t => t.id));

  return {
    text: "success",
    data: updated
  }
};

