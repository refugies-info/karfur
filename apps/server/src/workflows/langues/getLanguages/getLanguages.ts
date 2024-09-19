import { GetLanguagesResponse } from "@refugies-info/api-types";
import pick from "lodash/pick";
import logger from "~/logger";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { ResponseWithData } from "~/types/interface";

export const getLanguages = async (): ResponseWithData<GetLanguagesResponse[]> => {
  logger.info("[getLanguages] received");
  const activeLanguages = await getActiveLanguagesFromDB();

  const result: GetLanguagesResponse[] = activeLanguages.map((ln) => ({
    _id: ln._id.toString(),
    ...pick(ln, ["langueFr", "langueLoc", "langueCode", "i18nCode", "avancement"]),
    avancementTrad: ln.avancementTrad > 1 ? 1 : ln.avancementTrad,
  }));

  return {
    text: "success",
    data: result,
  };
};
