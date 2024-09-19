import { Id, MainSponsorRequest } from "@refugies-info/api-types";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { getDispositifById, updateDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { Dispositif } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const modifyDispositifMainSponsor = async (id: string, body: MainSponsorRequest, userId: Id): Response => {
  logger.info("[modifyDispositifMainSponsor]", body);

  const oldDispositif = await getDispositifById(id, { mainSponsor: 1, status: 1, hasDraftVersion: 1 });
  if (!oldDispositif) throw new NotFoundError("Dispositif not found");

  const modifiedDispositif: Partial<Dispositif> = {
    mainSponsor: body.sponsorId,
  };

  await updateDispositifInDB(id, modifiedDispositif, !!oldDispositif.hasDraftVersion);

  await log(oldDispositif, id, body.sponsorId, userId);

  return { text: "success" };
};
