import merge from "lodash/fp/merge";
import { DocumentType } from "@typegoose/typegoose";
import logger from "../../../logger";
import { getTheme, updateTheme } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Theme } from "../../../typegoose";
import { ThemeRequest } from "../../../controllers/themeController";
import { Picture, ResponseWithData, ThemeColors, TranslatedText } from "../../../types/interface";
import { NotFoundError } from "../../../errors";

export interface PatchThemeResponse {
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

export const patchTheme = async (id: string, theme: Partial<ThemeRequest>): ResponseWithData<PatchThemeResponse> => {
  logger.info("[patchTheme] received", id);

  const oldTheme = await getTheme(id);
  if (!oldTheme) throw new NotFoundError("Theme not found");

  let oldThemeObject: DocumentType<Theme> = oldTheme.toObject()
  const dbTheme = await updateTheme(id, merge(oldThemeObject, theme));
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: { ...dbTheme.toObject(), active: dbTheme.isActive(activeLanguages) }
  };
};

