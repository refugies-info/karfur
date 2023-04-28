import logger from "../../../logger";
import { cloneDispositifInDrafts, getDispositifById, getDraftDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, User } from "../../../typegoose";
import { DemarcheContent, DispositifContent, TranslationContent } from "../../../typegoose/Dispositif";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";
import { ContentType, DispositifStatus, UpdateDispositifRequest } from "@refugies-info/api-types";
import { buildNewDispositif, isDispositifComplete } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";

const buildDispositifContent = (body: UpdateDispositifRequest, oldDispositif: Dispositif): TranslationContent => {
  // content
  const content = { ...oldDispositif.translations.fr.content };
  if (body.titreInformatif) content.titreInformatif = body.titreInformatif;
  if (body.titreMarque) content.titreMarque = body.titreMarque;
  if (body.abstract) content.abstract = body.abstract;
  if (body.what) content.what = body.what;

  if (oldDispositif.typeContenu === ContentType.DISPOSITIF) {
    if (body.why) (content as DispositifContent).why = body.why;
    if (body.how) content.how = body.how;
  } else {
    if (body.how) content.how = body.how;
    if (body.next) (content as DemarcheContent).next = body.next;
  }

  return {
    content,
    created_at: oldDispositif.translations.fr.created_at,
    validatorId: oldDispositif.creatorId._id,
  };
};

export const updateDispositif = async (id: string, body: UpdateDispositifRequest, user: User): Response => {
  logger.info("[updateDispositif] received", { id, body, user: user._id });

  const draftOldDispositif = await getDraftDispositifById(
    id,
    { typeContenu: 1, translations: 1, mainSponsor: 1, creatorId: 1, status: 1 },
    "mainSponsor",
  );

  const oldDispositif = draftOldDispositif || await getDispositifById(
    id,
    { typeContenu: 1, translations: 1, mainSponsor: 1, creatorId: 1, status: 1 },
    "mainSponsor",
  );
  checkUserIsAuthorizedToModifyDispositif(oldDispositif, user);

  const translationContent = buildDispositifContent(body, oldDispositif);
  const editedDispositif: Partial<Dispositif> = {
    lastModificationAuthor: user._id,
    themesSelectedByAuthor: !user.isAdmin(),
    translations: {
      ...oldDispositif.translations,
      fr: translationContent
    },
    ...(await buildNewDispositif(body, user._id.toString())),
  };

  // if published and not draft version yet, create draft version
  let newDispositif: Dispositif | null = null;
  if (oldDispositif.status === DispositifStatus.ACTIVE && !draftOldDispositif) {
    newDispositif = await cloneDispositifInDrafts(id, {
      ...editedDispositif,
      status: DispositifStatus.DRAFT
    });
    await updateDispositifInDB(id, { hasDraftVersion: true }, false);
  } else {
    // else, we save in the current or draft version
    newDispositif = await updateDispositifInDB(id, editedDispositif, !!draftOldDispositif);

    // if dispositif becomes incomplete, revert it to DRAFT
    const isStatusWaiting =
      newDispositif.status === DispositifStatus.WAITING_ADMIN ||
      newDispositif.status === DispositifStatus.WAITING_STRUCTURE;
    if (isStatusWaiting && !isDispositifComplete(newDispositif)) {
      await updateDispositifInDB(id, { status: DispositifStatus.DRAFT });
    }
  }

  if (newDispositif) await log(newDispositif, oldDispositif, user._id);

  return { text: "success" };
};
