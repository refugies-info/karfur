import {
  ContentType,
  DispositifStatus,
  type UpdateDispositifRequest,
  type UpdateDispositifResponse,
} from "@refugies-info/api-types";
import type { DemarcheContent, DispositifContent, TranslationContent } from "@refugies-info/mongo";
import { type Dispositif, ObjectId, type StructureId, type User } from "@refugies-info/mongo";
import { isString, omit } from "lodash";
import { checkUserIsAuthorizedToModifyDispositif } from "~/libs/checkAuthorizations";
import { isToday } from "~/libs/isToday";
import { mapToPlainObject } from "~/libs/mongooseMaps";
import { countDispositifWords } from "~/libs/wordCounter";
import logger from "~/logger";
import {
  getDispositifMainSponsor,
  getDispositifTranslation,
} from "~/modules/dispositif/dispositif.business";
import {
  addNewParticipant,
  cloneDispositifInDrafts,
  getDispositifById,
  getDraftDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import {
  buildNewDispositif,
  isDispositifComplete,
  NotifType,
  notifyChange,
} from "~/modules/dispositif/dispositif.service";
import { logContact } from "~/modules/dispositif/log";
import type { ResponseWithData } from "~/types/interface";
import { log } from "./log";

const buildDispositifContent = (
  body: UpdateDispositifRequest,
  oldDispositif: Dispositif,
): TranslationContent => {
  // content - use helper to handle both Map and plain object access
  const frTranslation = getDispositifTranslation(oldDispositif, "fr", true);
  // Convert to plain object to avoid Map subdocument issues
  const content = mapToPlainObject(frTranslation?.content || {});
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
    if (body.administration)
      (content as DemarcheContent).administrationName = body.administration.name;
  }

  return {
    content,
    created_at: new Date(),
    validatorId: oldDispositif.creatorId as ObjectId,
  };
};

export const updateDispositif = async (
  id: string,
  body: UpdateDispositifRequest,
  user: User,
): ResponseWithData<UpdateDispositifResponse> => {
  logger.info("[updateDispositif] received", { id, body, user: user._id });

  const draftOldDispositif = await getDraftDispositifById(
    id,
    {
      typeContenu: 1,
      translations: 1,
      mainSponsor: 1,
      creatorId: 1,
      status: 1,
      lastModificationDate: 1,
      theme: 1,
      secondaryThemes: 1,
      administrationLogo: 1,
    },
    "mainSponsor",
  );

  const oldDispositif =
    draftOldDispositif ||
    (await getDispositifById(
      id,
      {
        typeContenu: 1,
        translations: 1,
        mainSponsor: 1,
        creatorId: 1,
        status: 1,
        lastModificationDate: 1,
        theme: 1,
        secondaryThemes: 1,
        administrationLogo: 1,
      },
      "mainSponsor",
    ));
  checkUserIsAuthorizedToModifyDispositif(oldDispositif, user, !!draftOldDispositif);

  const translationContent = buildDispositifContent(body, oldDispositif);

  // Convert translations to plain object (handles both Map and plain object)
  const existingTranslations = mapToPlainObject(oldDispositif.translations);

  const editedDispositif: Partial<Dispositif> = {
    lastModificationAuthor: user._id,
    lastModificationDate: new Date(),
    themesSelectedByAuthor: !user.isAdmin(),
    translations: {
      ...existingTranslations,
      fr: translationContent,
    },
    nbMots: countDispositifWords(translationContent.content as any),
    ...omit(await buildNewDispositif(body, user._id.toString()), "origin"),
  };

  // if published and not draft version yet, create draft version
  let newDispositif: Dispositif | null = null;
  const needsDraftVersion =
    [DispositifStatus.ACTIVE, DispositifStatus.ARCHIVED].includes(oldDispositif.status) &&
    !draftOldDispositif;
  if (needsDraftVersion) {
    newDispositif = await cloneDispositifInDrafts(id, {
      ...editedDispositif,
      status: DispositifStatus.DRAFT,
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
      newDispositif.status = DispositifStatus.DRAFT;
    }
  }

  if (body.contact) {
    await logContact(user._id, newDispositif.mainSponsor as StructureId, body.contact);
  }

  if (!newDispositif) throw new Error("dispositif not found");
  await addNewParticipant(new ObjectId(id), user._id);
  await log(newDispositif, oldDispositif, user._id, needsDraftVersion);

  // send notif only if non-admin user, and is today (= 1 notif per day maximum), and is active or waiting
  const isActive = oldDispositif.status === DispositifStatus.ACTIVE || !!draftOldDispositif;
  const isWaiting = [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE].includes(
    oldDispositif.status,
  );
  if (!isToday(oldDispositif.lastModificationDate) && !user.isAdmin() && (isWaiting || isActive)) {
    await notifyChange(NotifType.UPDATED, id, user._id);
  }

  return {
    text: "success",
    data: {
      id: newDispositif._id,
      mainSponsor:
        (newDispositif.mainSponsor as any)?._id?.toString() ||
        newDispositif.mainSponsor?.toString() ||
        null,
      typeContenu: newDispositif.typeContenu,
      status: newDispositif.status,
      hasDraftVersion: needsDraftVersion || !!draftOldDispositif,
      origin: newDispositif.origin,
    },
  };
};
