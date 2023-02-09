import logger from "../../../logger";
import { getAllThemes } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Picture, ResponseWithData, ThemeColors, TranslatedText } from "../../../types/interface";


export interface GetThemeResponse {
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

export const getThemes = async (): ResponseWithData<GetThemeResponse[]> => {
  logger.info("[getThemes] received");

  const themes = await getAllThemes();
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: themes.map((t) => ({ ...t.toObject(), active: t.isActive(activeLanguages) }))
  }
};

