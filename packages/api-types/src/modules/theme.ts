import { Id, Picture, ThemeColors, TranslatedText } from "../generics";

/**
 * @urls POST /themes, PATCH /themes/{id}
 */
export interface ThemeRequest {
  name: TranslatedText;
  short: TranslatedText;
  mainColor: string;
  colors: ThemeColors;
  position: number;
  icon?: Picture;
  banner?: Picture;
  appBanner?: Picture;
  appImage?: Picture;
  shareImage?: Picture;
  dispositifImage?: Picture;
  demarcheImage?: Picture;
  notificationEmoji: string;
  adminComments: string;
}

/**
 * @url GET /themes
 */
export interface GetThemeResponse {
  _id: Id;
  name: TranslatedText;
  short: TranslatedText;
  mainColor: string;
  colors: ThemeColors;
  position: number;
  icon?: Picture;
  banner?: Picture;
  appBanner?: Picture;
  appImage?: Picture;
  shareImage?: Picture;
  dispositifImage?: Picture;
  demarcheImage?: Picture;
  notificationEmoji: string;
  active: boolean;
  adminComments?: string;
}

/**
 * @url PATCH /themes/{id}
 */
export interface PatchThemeResponse {
  _id: string;
  name: TranslatedText;
  short: TranslatedText;
  mainColor: string;
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  dispositifImage?: Picture;
  demarcheImage?: Picture;
  notificationEmoji: string;
  active: boolean;
  adminComments?: string;
}

/**
 * @url POST /themes
 */
export interface PostThemeResponse {
  _id: string;
  name: TranslatedText;
  short: TranslatedText;
  mainColor: string;
  colors: ThemeColors;
  position: number;
  icon?: Picture;
  banner?: Picture;
  appBanner?: Picture;
  appImage?: Picture;
  shareImage?: Picture;
  dispositifImage?: Picture;
  demarcheImage?: Picture;
  notificationEmoji: string;
  active: boolean;
  adminComments?: string;
}
