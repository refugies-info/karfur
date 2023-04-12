import logger from "../../../logger";
import { getDispositifsWithCreatorId } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";
import { pick } from "lodash";
import { GetUserContributionsResponse } from "@refugies-info/api-types";

export const getUserContributions = async (userId: any): ResponseWithData<GetUserContributionsResponse[]> => {
  logger.info("[getUserContributions] received");

  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    typeContenu: 1,
    mainSponsor: 1,
    nbVues: 1,
    status: 1,
    merci: 1,
    translations: 1,
  };
  const dispositifs = await getDispositifsWithCreatorId(userId, neededFields);

  const res: GetUserContributionsResponse[] = dispositifs.map((d) => ({
    ...pick(d, ["_id", "typeContenu", "status", "mainSponsor", "nbVues"]),
    ...pick(d.translations.fr.content, ["titreInformatif", "titreMarque"]),
    nbMercis: d.merci.length,
  }));

  return { text: "success", data: res };
};
