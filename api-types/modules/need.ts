import { Id, Picture, SimpleTheme } from "../generics";

export interface NeedTranslation {
  text: string;
  subtitle: string;
  updatedAt?: Date;
}

/**
 * @url POST /needs
 */
export interface NeedRequest {
  fr: {
    text: string;
    subtitle: string;
  };
  theme?: string;
  image?: Picture;
  adminComments: string;
}

/**
 * @url POST /needs/positions
 */
export interface UpdatePositionsRequest {
  orderedNeedIds: string[];
}

/**
 * @url GET /needs
 */
export interface GetNeedResponse {
  _id: Id;
  theme: SimpleTheme;
  adminComments?: string;
  nbVues: number;
  position?: number;
  fr: NeedTranslation;
  ar: NeedTranslation;
  en: NeedTranslation;
  ru: NeedTranslation;
  fa: NeedTranslation;
  ti: NeedTranslation;
  ps: NeedTranslation;
  uk: NeedTranslation;
  image?: Picture;
}

/**
 * @url POST /needs/positions
 */
export interface UpdatePositionsNeedResponse {
  _id: Id;
  theme: SimpleTheme;
  adminComments?: string;
  nbVues: number;
  position?: number;
  fr: NeedTranslation;
  ar: NeedTranslation;
  en: NeedTranslation;
  ru: NeedTranslation;
  fa: NeedTranslation;
  ti: NeedTranslation;
  ps: NeedTranslation;
  uk: NeedTranslation;
}
