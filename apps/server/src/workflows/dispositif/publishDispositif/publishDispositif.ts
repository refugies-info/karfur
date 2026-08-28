import {
  ContentType,
  DispositifStatus,
  type PublishDispositifRequest,
} from "@refugies-info/api-types";
import type { TranslationContent } from "@refugies-info/mongo";
import { type Dispositif, Traductions, type User } from "@refugies-info/mongo";
import { isEmpty } from "lodash";
import { InvalidRequestError } from "~/errors";
import { checkUserIsAuthorizedToModifyDispositif } from "~/libs/checkAuthorizations";
import logger from "~/logger";
import {
  getChangedMetadatasLabels,
  getDispositifMainSponsor,
  getDispositifTranslation,
  isDispositifTranslatedIn,
} from "~/modules/dispositif/dispositif.business";
import {
  addNewParticipant,
  getDispositifById,
  getDraftDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import {
  getMissingDispositifFields,
  NotifType,
  notifyChange,
  publishDispositif as publishDispositifService,
} from "~/modules/dispositif/dispositif.service";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "~/modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
import { takeSnapshot } from "~/modules/snapshots/snapshots.service";
import { diffTraductions } from "~/modules/traductions/traductions.business";
import type { Response } from "~/types/interface";
import { log } from "./log";

const hasChanges = (originalContent: TranslationContent, draftContent: TranslationContent) => {
  const traductionDiff = diffTraductions(originalContent, draftContent);
  return !isEmpty(traductionDiff.modified) || !isEmpty(traductionDiff.added);
};

const getWaitingStatus = async (
  dispositif: Dispositif,
  oldDispositif: Dispositif,
  user: User,
): Promise<DispositifStatus | null> => {
  const mainSponsor = getDispositifMainSponsor(dispositif);
  const isInStructure = mainSponsor?.membres?.find(
    (membre) => membre.userId.toString() === user._id.toString(),
  );
  const isNewStructure = (mainSponsor?.membres?.length ?? 0) === 0;
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
};

export const publishDispositif = async (
  id: string,
  body: PublishDispositifRequest,
  user: User,
): Response => {
  logger.info("[publishDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(
    id,
    {
      status: 1,
      creatorId: 1,
      theme: 1,
      mainSponsor: 1,
      translations: 1,
      typeContenu: 1,
      metadatas: 1,
      hasDraftVersion: 1,
    },
    "mainSponsor",
  );

  let draftDispositif = null;
  if (oldDispositif.hasDraftVersion) {
    draftDispositif = await getDraftDispositifById(
      id,
      {
        status: 1,
        creatorId: 1,
        theme: 1,
        mainSponsor: 1,
        translations: 1,
        typeContenu: 1,
        metadatas: 1,
        hasDraftVersion: 1,
      },
      "mainSponsor",
    );
  }

  const dispositif = draftDispositif || oldDispositif;
  const missingFields = getMissingDispositifFields(dispositif);
  if (missingFields.length > 0) {
    throw new InvalidRequestError(
      `The content is incomplete, it cannot be published (missing: ${missingFields.join(", ")})`,
    );
  }

  checkUserIsAuthorizedToModifyDispositif(dispositif, user, oldDispositif.hasDraftVersion);

  // if deleted or rejected, cannot be published
  if ([DispositifStatus.DELETED, DispositifStatus.KO_STRUCTURE].includes(dispositif.status)) {
    throw new InvalidRequestError("The content cannot be published");
  }

  const editedDispositif: Partial<Dispositif> = {};

  // if dispositif already published...
  if ([DispositifStatus.ACTIVE, DispositifStatus.ARCHIVED].includes(oldDispositif.status)) {
    if (oldDispositif.hasDraftVersion) {
      // with a draft version => publish
      const isAdmin = user.isAdmin();
      const hasTextChanges = hasChanges(
        getDispositifTranslation(oldDispositif, "fr"),
        getDispositifTranslation(draftDispositif, "fr"),
      );

      if (isAdmin || !hasTextChanges) {
        // admin or no changes in translations -> publish
        // (non-admin = aucun texte modifié, on cite les metadatas changées dans la notif)
        await publishDispositifService(
          id,
          user._id,
          isAdmin ? body.keepTranslations : false,
          isAdmin
            ? undefined
            : {
                changedMetadatas: getChangedMetadatasLabels(
                  oldDispositif.metadatas,
                  draftDispositif.metadatas,
                ),
              },
        );
      } else {
        // else, wait for admin validation, set the draft's status to UPDATE_TO_VALIDATE
        await updateDispositifInDB(id, { status: DispositifStatus.UPDATE_TO_VALIDATE }, true);
        if (oldDispositif.typeContenu === ContentType.DISPOSITIF) {
          await takeSnapshot(
            dispositif,
            "before",
            oldDispositif.status,
            DispositifStatus.UPDATE_TO_VALIDATE,
          );
        }
        await notifyChange(NotifType.TO_VALIDATE, id, user._id);
      }
    } else {
      // with no draft version (= no change) => do nothing
      return { text: "success" };
    }
  } else {
    // else => find the appropriate waiting status
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
