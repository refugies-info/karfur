/**
 * @url GET /langues
 */
export interface GetLanguagesResponse {
  _id: string;
  langueFr: string;
  langueLoc?: string;
  langueCode?: string;
  i18nCode: string;
  avancement: number;
  avancementTrad: number;
}
