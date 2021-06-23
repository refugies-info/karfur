import { ObjectId } from "mongodb";

export interface Language {
  langueFr: string;
  i18nCode: string;
  _id: ObjectId;
  avancementTrad: number;
}

interface Tag {
  short: string;
}
export interface SimplifiedContent {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque?: string;
  tags: Tag[];
}

export type AvailableLanguageI18nCode =
  | "fr"
  | "en"
  | "ps"
  | "ar"
  | "ti-ER"
  | "ru"
  | "fa";
