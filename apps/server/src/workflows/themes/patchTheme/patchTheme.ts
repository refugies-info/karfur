import type { PatchThemeResponse, ThemeRequest } from "@refugies-info/api-types";
import merge from "lodash/fp/merge";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getTheme, updateTheme } from "~/modules/themes/themes.repository";
import type { ResponseWithData } from "~/types/interface";

export const patchTheme = async (
  id: string,
  theme: Partial<ThemeRequest>,
): ResponseWithData<PatchThemeResponse> => {
  logger.info("[patchTheme] received", id);

  const oldTheme = await getTheme(id);
  if (!oldTheme) throw new NotFoundError("Theme not found");

  const oldThemeObject = oldTheme.toObject();
  const dbTheme = await updateTheme(id, merge(oldThemeObject, theme));
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: {
      ...dbTheme.toObject(),
      active: dbTheme.isActive(activeLanguages),
    } as unknown as PatchThemeResponse,
  };
};
