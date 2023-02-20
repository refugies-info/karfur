import logger from "../../../logger";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { map } from "lodash/fp";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { Dispositif, Languages } from "../../../typegoose";
import { GetDispositifsRequest } from "../../../controllers/dispositifController";
import { ResponseWithData, SimpleDispositif } from "../../../types/interface";
import { FilterQuery } from "mongoose";

export type GetDispositifsResponse = SimpleDispositif;

export const getDispositifs = async (query: GetDispositifsRequest): ResponseWithData<GetDispositifsResponse[]> => {
  logger.info("[getDispositifs] called");
  const { type, locale, limit, sort } = query;

  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = { status: "Actif" };
  if (type) dbQuery.typeContenu = type;

  /* TODO: factorize this (also in 2 other files) */
  return getDispositifArray(dbQuery, {
    lastModificationDate: 1,
    mainSponsor: 1,
    needs: 1
  }, "", limit, sort)
    .then(map((dispositif) => {
      const resDisp: GetDispositifsResponse = {
        _id: dispositif._id,
        ...pick(dispositif.translations[selectedLocale].content, ["titreInformatif", "titreMarque", "abstract"]),
        metadatas: { ...dispositif.metadatas, ...dispositif.translations[selectedLocale].metadatas },
        ...omit(dispositif, ["translations"]),
      }
      return resDisp
    }))
    .then((result) => ({
      text: "success",
      data: result
    }))
};

