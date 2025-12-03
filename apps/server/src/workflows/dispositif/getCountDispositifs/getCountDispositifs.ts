import {
  type CountDispositifsRequest,
  DispositifStatus,
  type GetCountDispositifsResponse,
} from "@refugies-info/api-types";
import type { FilterQuery } from "mongoose";
import logger from "~/logger";
import { getCountDispositifs as countDispositifs } from "~/modules/dispositif/dispositif.repository";
import type { Dispositif } from "~/typegoose";
import type { ResponseWithData } from "~/types/interface";

export const getCountDispositifs = async (
  query: CountDispositifsRequest,
): ResponseWithData<GetCountDispositifsResponse> => {
  logger.info("[getCountDispositifs] dispositif");

  const dbQuery: FilterQuery<Dispositif> = {};
  if (query.type) dbQuery.typeContenu = query.type;
  if (query.publishedOnly) dbQuery.status = DispositifStatus.ACTIVE;
  if (query.themeId) dbQuery.theme = query.themeId;

  const res = await countDispositifs(dbQuery);

  return {
    text: "success",
    data: { count: res },
  };
};
