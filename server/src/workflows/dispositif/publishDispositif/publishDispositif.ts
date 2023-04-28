import { DispositifStatus, PublishDispositifRequest } from "@refugies-info/api-types";
import logger from "../../../logger";
import { getDispositifById, getDraftDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, User } from "../../../typegoose";
import { InvalidRequestError } from "../../../errors";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
import { publishDispositif as publishDispositifService, isDispositifComplete } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";

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

  checkUserIsAuthorizedToModifyDispositif(dispositif, user);

  // if deleted or rejected, cannot be published
  if ([
    DispositifStatus.DELETED,
    DispositifStatus.KO_STRUCTURE,
  ].includes(dispositif.status)) {
    throw new InvalidRequestError("The content cannot be published");
  }

  const editedDispositif: Partial<Dispositif> = {};
  // if admin or editing a published dispositif => publish
  if (user.isAdmin() || (oldDispositif.status === DispositifStatus.ACTIVE && oldDispositif.hasDraftVersion)) {
    await publishDispositifService(id, user._id, user.isAdmin() ? body.keepTranslations : false);
  }

  if (dispositif.getMainSponsor()?.membres.find((membre) => membre.userId === user._id)) {
    // dans la structure
    editedDispositif.status = DispositifStatus.WAITING_ADMIN;
  } else {
    // pas dans la structure
    editedDispositif.status = DispositifStatus.WAITING_STRUCTURE;
    await sendMailToStructureMembersWhenDispositifEnAttente(oldDispositif);
  }

  if (editedDispositif.status) {
    const newDispositif = await updateDispositifInDB(id, editedDispositif);
    await log(newDispositif, oldDispositif, user._id);
  }

  return { text: "success" };
};
