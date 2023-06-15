import { DispositifStatus, PublishDispositifRequest } from "@refugies-info/api-types";
import logger from "../../../logger";
import { addNewParticipant, getDispositifById, getDraftDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, User } from "../../../typegoose";
import { InvalidRequestError } from "../../../errors";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
import { publishDispositif as publishDispositifService, isDispositifComplete } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";

const getWaitingStatus = async (dispositif: Dispositif, oldDispositif: Dispositif, user: User): Promise<DispositifStatus | null> => {
  const isInStructure = dispositif.getMainSponsor()?.membres.find((membre) => membre.userId.toString() === user._id.toString());
  const isNewStructure = dispositif.getMainSponsor()?.membres.length === 0;
  if (isInStructure || isNewStructure) {
    // dans la structure
    return DispositifStatus.WAITING_ADMIN;
  } else if (user.isAdmin()) {
    // admin et brouillon
    if ([DispositifStatus.DRAFT].includes(oldDispositif.status)) {
      return DispositifStatus.WAITING_ADMIN;
    }
  } else {
    // pas dans la structure et pas admin
    await sendMailToStructureMembersWhenDispositifEnAttente(oldDispositif);
    return DispositifStatus.WAITING_STRUCTURE;
  }
  return null;
}

export const publishDispositif = async (id: string, body: PublishDispositifRequest, user: User): Response => {
  logger.info("[publishDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(
    id,
    { status: 1, creatorId: 1, theme: 1, mainSponsor: 1, translations: 1, typeContenu: 1, metadatas: 1, hasDraftVersion: 1 },
    "mainSponsor",
  );

  let draftDispositif = null;
  if (oldDispositif.hasDraftVersion) {
    draftDispositif = await getDraftDispositifById(
      id,
      { status: 1, creatorId: 1, theme: 1, mainSponsor: 1, translations: 1, typeContenu: 1, metadatas: 1, hasDraftVersion: 1 },
      "mainSponsor",
    );
  }

  const dispositif = draftDispositif || oldDispositif;
  if (!isDispositifComplete(dispositif)) {
    throw new InvalidRequestError("The content is incomplete, it cannot be published");
  }

  checkUserIsAuthorizedToModifyDispositif(dispositif, user, oldDispositif.hasDraftVersion);

  // if deleted or rejected, cannot be published
  if ([
    DispositifStatus.DELETED,
    DispositifStatus.KO_STRUCTURE,
  ].includes(dispositif.status)) {
    throw new InvalidRequestError("The content cannot be published");
  }

  const editedDispositif: Partial<Dispositif> = {};
  // if editing a published dispositif => publish
  if (oldDispositif.status === DispositifStatus.ACTIVE && oldDispositif.hasDraftVersion) {
    await publishDispositifService(id, user._id, user.isAdmin() ? body.keepTranslations : false);
  } else {
    const status = await getWaitingStatus(dispositif, oldDispositif, user);
    if (status) editedDispositif.status = status;
  }

  if (editedDispositif.status) {
    const newDispositif = await updateDispositifInDB(id, editedDispositif);
    await log(newDispositif, oldDispositif, user._id);
  }

  await addNewParticipant(id, user._id);

  return { text: "success" };
};
