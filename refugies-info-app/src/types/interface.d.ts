import { ObjectId } from "mongodb";

export interface Language {
  langueFr: string;
  i18nCode: string;
  _id: ObjectId;
  avancementTrad: number;
}
