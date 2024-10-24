import { DispositifStatus, StructureStatus } from "@refugies-info/api-types";
import { AxiosResponse } from "axios";

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
  adminStatus?: string;
  order: number;
} & Status;

export type StructureAdminStatus = {
  storedStatus: StructureStatus;
  order: number;
} & Status;

export type UserStatusType = "Respo" | "Admin" | "Experts" | "Traducteurs" | "Multi-structure" | "Tous";
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
