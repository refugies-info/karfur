import logger from "../../../logger";
import { getSimpleDispositifs } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif, Languages } from "../../../typegoose";
import { ResponseWithData } from "../../../types/interface";
import { FilterQuery } from "mongoose";
import { DispositifStatus, GetDispositifsRequest, GetDispositifsResponse } from "api-types";

export const getDispositifs = async (query: GetDispositifsRequest): ResponseWithData<GetDispositifsResponse[]> => {
  logger.info("[getDispositifs] called");
  const { type, locale, limit, sort } = query;

  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = { status: DispositifStatus.ACTIVE };
  if (type) dbQuery.typeContenu = type;

  const result = await getSimpleDispositifs(dbQuery, selectedLocale, limit, sort);
  return {
    text: "success",
    data: result
  }
};

