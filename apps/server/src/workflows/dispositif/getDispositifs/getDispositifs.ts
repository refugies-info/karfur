import {
  DispositifStatus,
  type GetDispositifsRequest,
  type Languages,
  type SimpleDispositif,
} from "@refugies-info/api-types";
import type { Dispositif } from "@refugies-info/mongo";
import type { FilterQuery } from "mongoose";
import logger from "~/logger";
import { getSimpleDispositifs } from "~/modules/dispositif/dispositif.repository";
import type { ResponseWithData } from "~/types/interface";

export const getDispositifs = async (
  query: GetDispositifsRequest,
): ResponseWithData<SimpleDispositif[]> => {
  logger.info("[getDispositifs] called");
  const { type, locale, limit, sort, origin } = query;

  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = { status: DispositifStatus.ACTIVE };
  if (type) dbQuery.typeContenu = type;
  if (origin) dbQuery.origin = origin;

  const result = await getSimpleDispositifs(
    dbQuery,
    selectedLocale,
    limit,
    sort ? { [sort]: -1 } : {},
  );
  return {
    text: "success",
    data: result as SimpleDispositif[],
  };
};
