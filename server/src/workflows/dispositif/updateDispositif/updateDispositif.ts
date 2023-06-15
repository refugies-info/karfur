import logger from "../../../logger";
import { addNewParticipant, cloneDispositifInDrafts, getDispositifById, getDraftDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";
import { Dispositif, ObjectId, User } from "../../../typegoose";
import { DemarcheContent, DispositifContent, TranslationContent } from "../../../typegoose/Dispositif";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";
import { ContentType, DispositifStatus, UpdateDispositifRequest, UpdateDispositifResponse } from "@refugies-info/api-types";
import { buildNewDispositif, isDispositifComplete } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";
import { logContact } from "../../../modules/dispositif/log";
import { isString } from "lodash";
import { countDispositifWords } from "../../../libs/wordCounter";

const buildDispositifContent = (body: UpdateDispositifRequest, oldDispositif: Dispositif): TranslationContent => {
  // content
  const content = { ...oldDispositif.translations.fr.content };
  // check isString to allow empty values
  if (isString(body.titreInformatif)) content.titreInformatif = body.titreInformatif;
  if (isString(body.titreMarque)) content.titreMarque = body.titreMarque;
  if (isString(body.abstract)) content.abstract = body.abstract;
  if (isString(body.what)) content.what = body.what;

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

export const updateDispositif = async (id: string, body: UpdateDispositifRequest, user: User): ResponseWithData<UpdateDispositifResponse> => {
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
  checkUserIsAuthorizedToModifyDispositif(oldDispositif, user, !!draftOldDispositif);

  const translationContent = buildDispositifContent(body, oldDispositif);
  const editedDispositif: Partial<Dispositif> = {
    lastModificationAuthor: user._id,
    lastModificationDate: new Date(),
    themesSelectedByAuthor: !user.isAdmin(),
    translations: {
      ...oldDispositif.translations,
      fr: translationContent
    },
    nbMots: countDispositifWords(translationContent.content),
    ...(await buildNewDispositif(body, user._id.toString())),
  };

  if (body.contact) {
    await logContact(oldDispositif._id, user._id, body.contact)
  }

  // if published and not draft version yet, create draft version
  let newDispositif: Dispositif | null = null;
  const needsDraftVersion = oldDispositif.status === DispositifStatus.ACTIVE && !draftOldDispositif;
  if (needsDraftVersion) {
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

  if (!newDispositif) throw new Error("dispositif not found");
  await addNewParticipant(new ObjectId(id), user._id);
  await log(newDispositif, oldDispositif, user._id);

  return {
    text: "success",
    data: {
      id: newDispositif._id,
      mainSponsor: newDispositif.mainSponsor as string || null,
      typeContenu: newDispositif.typeContenu,
      status: newDispositif.status,
      hasDraftVersion: needsDraftVersion || !!draftOldDispositif
    }
  };
};
