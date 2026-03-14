import type { GetUserContributionsResponse } from "@refugies-info/api-types";
import type { UserId } from "@refugies-info/mongo";
import { pick } from "lodash";
import logger from "~/logger";
import { getDispositifsWithCreatorId } from "~/modules/dispositif/dispositif.repository";
import type { ResponseWithData } from "~/types/interface";

export const getUserContributions = async (
  userId: UserId,
): ResponseWithData<GetUserContributionsResponse[]> => {
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
    hasDraftVersion: 1,
    origin: 1,
  };
  const dispositifs: any[] = await getDispositifsWithCreatorId(userId, neededFields);

  const res: GetUserContributionsResponse[] = dispositifs.map((d) => ({
    ...pick(d, ["_id", "typeContenu", "status", "mainSponsor", "nbVues", "origin"]),
    ...pick(d.translations?.fr?.content ?? {}, ["titreInformatif", "titreMarque"]),
    nbMercis: (d.merci ?? []).length,
    hasDraftVersion: !!d.hasDraftVersion,
  }));

  return { text: "success", data: res };
};
