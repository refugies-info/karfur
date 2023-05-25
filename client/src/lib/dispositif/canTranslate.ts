import { GetDispositifResponse } from "@refugies-info/api-types";

export const canTranslate = (
  dispositif: GetDispositifResponse,
  queryLanguage: string,
  isAdminOrExpert: boolean
) => isAdminOrExpert || !dispositif.availableLanguages.includes(queryLanguage)
