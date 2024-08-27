import { GetThemeResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getAllThemes } from "~/modules/themes/themes.repository";
import { ResponseWithData } from "~/types/interface";

export const getThemes = async (): ResponseWithData<GetThemeResponse[]> => {
  logger.info("[getThemes] received");

  const themes = await getAllThemes();
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: themes.map((t) => ({ ...t.toObject(), active: t.isActive(activeLanguages) })),
  };
};
