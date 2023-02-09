import { getUserById } from "../users/users.repository";
import logger from "../../logger";
import {
  sendPublishedFicheMailToStructureMembersService,
  sendPublishedFicheMailToCreatorService,
} from "./mail.service";
import { User, UserStatus } from "src/typegoose/User";
import { Dispositif } from "src/typegoose";

export const sendPublishedMailToCreator = async (
  newDispo: Dispositif,
  titreInformatif: string,
  titreMarque: string,
  lien: string,
) => {
  const userNeededFields = {
    username: 1,
    email: 1,
    status: 1,
  };

  const creator = await getUserById(newDispo.creatorId._id, userNeededFields);
  if (creator.status === UserStatus.USER_STATUS_DELETED) return;
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
  membres: User[],
  titreInformatif: string,
  titreMarque: string,
  lien: string,
  dispositifId: Dispositif["_id"],
) =>
  membres.map((membre) => {
    logger.info("[sendPublishedMailToStructureMembers] send mail to membre", {
      membreId: membre._id,
    });
    return sendPublishedFicheMailToStructureMembersService({
      pseudo: membre.username,
      titreInformatif: titreInformatif,
      titreMarque: titreMarque,
      lien,

      email: membre.email,
      dispositifId,
      userId: membre._id,
    });
  });
