import merge from "lodash/fp/merge";
import { DocumentType } from "@typegoose/typegoose";
import logger from "../../../logger";
import { getTheme, updateTheme } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Theme as ThemeDB } from "../../../typegoose";
import { ThemeParams } from "../../../controllers/themeController";
import { ResponseWithData } from "../../../types/interface";
import { NotFoundError } from "../../../errors";

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

export const patchTheme = async (id: string, theme: Partial<ThemeParams>): Promise<ResponseWithData<Theme>> => {
  logger.info("[patchTheme] received", id);

  const oldTheme = await getTheme(id);
  if (!oldTheme) throw new NotFoundError("Theme not found");

  let oldThemeObject: DocumentType<ThemeDB> = oldTheme.toObject()
  const dbTheme = await updateTheme(id, merge(oldThemeObject, theme));
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: { ...dbTheme.toObject(), active: dbTheme.isActive(activeLanguages) }
  };
};

