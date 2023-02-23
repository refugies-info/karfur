import { Id } from "../generics";

/**
 * @url GET /langues
 */
export interface GetLanguagesResponse {
  _id: Id,
  langueFr: string;
  langueLoc?: string;
  langueCode?: string;
  i18nCode: string;
  avancement: number;
  avancementTrad: number;
}
