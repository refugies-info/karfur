import logger from "../../../logger";
import { getAllThemes } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { ResponseWithData } from "../../../types/interface";

interface Image {
  secure_url: string;
  public_id: string;
  imgId: string;
}

export interface Theme {
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

export const getThemes = async (): Promise<ResponseWithData<Theme[]>> => {
  logger.info("[getThemes] received");

  const themes = await getAllThemes();
  const activeLanguages = await getActiveLanguagesFromDB();

  return {
    text: "success",
    data: themes.map((t) => ({ ...t.toObject(), active: t.isActive(activeLanguages) }))
  }
};

