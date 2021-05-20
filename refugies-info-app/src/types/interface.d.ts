import { ObjectId } from "mongodb";

export interface Language {
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  i18nCode: string;
  _id: ObjectId;
  avancement: number;
}
