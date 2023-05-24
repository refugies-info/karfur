import { AxiosResponse } from "axios";
import { DispositifStatus, StructureStatus, GetDispositifResponse, GetDispositifsResponse, Id } from "@refugies-info/api-types";

export type APIResponse<T = null> = AxiosResponse<{
  text: "success" | "error";
  data: T;
}>;

export interface Event {
  target: { id: string; value: string };
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
