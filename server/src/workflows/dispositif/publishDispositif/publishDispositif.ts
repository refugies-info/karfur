import { DispositifStatus, PublishDispositifRequest } from "api-types";
import logger from "../../../logger";
import { getDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, User } from "../../../typegoose";
import { InvalidRequestError } from "../../../errors";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
import { isDispositifComplete } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";

export const publishDispositif = async (id: string, body: PublishDispositifRequest, user: User): Response => {
  logger.info("[publishDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(id, { status: 1, creatorId: 1, theme: 1, mainSponsor: 1, translations: 1, typeContenu: 1, metadatas: 1 }, "mainSponsor");

  if (!isDispositifComplete(oldDispositif)) {
    throw new InvalidRequestError("The content is incomplete, it cannot be published")
  }

  const editedDispositif: Partial<Dispositif> = {};

  if (oldDispositif.status !== DispositifStatus.DRAFT) {
    throw new InvalidRequestError("The content cannot be published")
  }

  if (oldDispositif.getMainSponsor()?.membres.find(membre => membre.userId === user._id)) { // dans la structure
    editedDispositif.status = DispositifStatus.WAITING_ADMIN;
  } else { // pas dans la structure
    editedDispositif.status = DispositifStatus.WAITING_STRUCTURE;
    await sendMailToStructureMembersWhenDispositifEnAttente(oldDispositif);
  }

  if (editedDispositif.status) {
    const newDispositif = await updateDispositifInDB(id, editedDispositif);
    await log(newDispositif, oldDispositif, user._id);
  }

  return { text: "success" };
};
