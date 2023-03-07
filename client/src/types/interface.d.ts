import { AxiosResponse } from "axios";
import { DispositifStatus, StructureStatus, GetDispositifResponse, GetDispositifsResponse, Id } from "api-types";

export type APIResponse<T = null> = AxiosResponse<{
  text: "success" | "error";
  data: T;
}>;

export interface Event {
  target: { id: string; value: string };
}

export interface Indicator {
  _id: Id;
  wordsCount: number;
  timeSpent: number;
}

type iconName = "house" | "search" | "message" | "menu" | "tag" | "";
/**
 * @deprecated
 */
export interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}
/**
 * @deprecated
 */
export interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic: boolean;
  precisions?: string;
}

export interface Translation {
  _id?: Id;
  initialText?: object;
  translatedText?: object;
  langueCible?: string;
  articleId?: Id;
  timeSpent?: string;
  isStructure?: boolean;
  avancement?: number;
  type?: string;
  validatorId?: Id;
  isExpert?: boolean;
}

export type AvailableLanguageI18nCode = "fr" | "en" | "ps" | "ar" | "ti" | "ru" | "uk" | "fa";

export type Status = {
  displayedStatus: string;
  color: string;
  textColor?: string;
};

export type ContentStatus = {
  storedStatus: DispositifStatus;
  order: number;
} & Status;

export type StructureAdminStatus = {
  storedStatus: StructureStatus;
  order: number;
} & Status;

export type UserStatusType = "Respo" | "Admin" | "Experts" | "Traducteurs" | "Rédacteurs" | "Multi-structure" | "Tous";
export type UserStatus = {
  storedStatus: UserStatusType;
  order: number;
} & Status;

export type ProgressionStatus = {
  storedStatus: string;
} & Status;

export type PageOptions = {
  cookiesModule: boolean;
  supportModule: boolean;
};
