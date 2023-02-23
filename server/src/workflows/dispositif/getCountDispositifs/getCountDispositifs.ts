
import { CountDispositifsRequest, GetCountDispositifsResponse } from "api-types";
import { FilterQuery } from "mongoose";
import { Dispositif } from "../../../typegoose";
import logger from "../../../logger";
import { getCountDispositifs as countDispositifs } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";



export const getCountDispositifs = async (query: CountDispositifsRequest): ResponseWithData<GetCountDispositifsResponse> => {
  logger.info("[getCountDispositifs] dispositif");

  const dbQuery: FilterQuery<Dispositif> = {};
  if (query.type) dbQuery.typeContenu = query.type;
  if (query.publishedOnly) dbQuery.status = "Actif";
  if (query.themeId) dbQuery.theme = query.themeId;

  const res = await countDispositifs(dbQuery);

  return {
    text: "success",
    data: { count: res }
  }
};
