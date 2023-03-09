import merge from "lodash/fp/merge";
import { DocumentType } from "@typegoose/typegoose";
import logger from "../../../logger";
import { getTheme, updateTheme } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Theme } from "../../../typegoose";
import { ResponseWithData } from "../../../types/interface";
import { NotFoundError } from "../../../errors";
import { PatchThemeResponse, ThemeRequest } from "api-types";


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

