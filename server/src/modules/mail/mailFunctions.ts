import { DispositifNotPopulateDoc } from "../../schema/schemaDispositif";
import { USER_STATUS_DELETED } from "../../schema/schemaUser";
import { getUserById } from "../users/users.repository";
import logger from "../../logger";
import {
  sendPublishedFicheMailToStructureMembersService,
  sendPublishedFicheMailToCreatorService,
} from "./mail.service";
import { asyncForEach } from "../../libs/asyncForEach";
import { ObjectId } from "mongoose";

export const sendPublishedMailToCreator = async (
  newDispo: DispositifNotPopulateDoc,
  titreInformatif: string,
  titreMarque: string,
  lien: string
) => {
  const userNeededFields = {
    username: 1,
    email: 1,
    status: 1,
  };

  const creator = await getUserById(newDispo.creatorId, userNeededFields);
  if (creator.status === USER_STATUS_DELETED) return;
  if (creator.email) {
    logger.info("[publish dispositif] creator has email");

    await sendPublishedFicheMailToCreatorService({
      pseudo: creator.username,
      titreInformatif,
      titreMarque,
      lien,
      email: creator.email,
      dispositifId: newDispo._id,
      userId: creator._id,
    });
  }
};

export const sendPublishedMailToStructureMembers = async (
  membres: { username: string; _id: ObjectId; email: string }[],
  titreInformatif: string,
  titreMarque: string,
  lien: string,
  dispositifId: ObjectId
) => {
  await asyncForEach(membres, async (membre) => {
    logger.info("[sendPublishedMailToStructureMembers] send mail to membre", {
      membreId: membre._id,
    });
    await sendPublishedFicheMailToStructureMembersService({
      pseudo: membre.username,
      titreInformatif: titreInformatif,
      titreMarque: titreMarque,
      lien,

      email: membre.email,
      dispositifId,
      userId: membre._id,
    });
  });
};
