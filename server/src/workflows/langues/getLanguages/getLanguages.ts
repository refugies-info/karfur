import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import pick from "lodash/pick";
import { GetLanguagesResponse } from "api-types";

export const getLanguages = async (): ResponseWithData<GetLanguagesResponse[]> => {
  logger.info("[getLanguages] received");
  const activeLanguages = await getActiveLanguagesFromDB();

  const result: GetLanguagesResponse[] = activeLanguages.map(ln => ({
    ...pick(ln, ["_id", "langueFr", "langueLoc", "langueCode", "i18nCode", "avancement"]),
    avancementTrad: ln.avancementTrad > 1 ? 1 : ln.avancementTrad
  }))

  return {
    text: "success",
    data: result,
  }
};
