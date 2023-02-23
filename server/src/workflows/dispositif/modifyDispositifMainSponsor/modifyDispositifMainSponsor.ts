import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { log } from "./log";
import { Dispositif } from "../../../typegoose";
import { NotFoundError } from "../../../errors";
import { Id, MainSponsorRequest } from "api-types";

export const modifyDispositifMainSponsor = async (id: string, body: MainSponsorRequest, userId: Id): Response => {
  logger.info("[modifyDispositifMainSponsor]", body);

  const oldDispositif = await getDispositifById(id, { mainSponsor: 1, status: 1 });
  if (!oldDispositif) throw new NotFoundError("Dispositif not found");

  const modifiedDispositif: Partial<Dispositif> = {
    mainSponsor: body.sponsorId,
  };
  if (oldDispositif.status === "En attente non prioritaire") modifiedDispositif.status = "En attente";

  await updateDispositifInDB(id, modifiedDispositif);

  await updateAssociatedDispositifsInStructure(id, body.sponsorId);

  await log(oldDispositif, id, body.sponsorId, userId);

  return { text: "success" };

};
