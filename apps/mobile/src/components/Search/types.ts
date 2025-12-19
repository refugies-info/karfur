import type { Id } from "@refugies-info/api-types";

export interface SearchItem {
  typeContenu: "theme" | "besoin" | "dispositif" | "demarche";
  objectID: string;
  title_fr: string;
  name_fr?: string;
  theme: Id | { _id: string };
  _id: string;
  appImage?: string;
  needs?: Id[];
  title?: string;
  type?: string;
}
