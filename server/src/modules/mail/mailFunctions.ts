import { UserStatus } from "@refugies-info/api-types";
import logger from "../../logger";
import { Dispositif } from "../../typegoose";
import { User } from "../../typegoose/User";
import { getUserById } from "../users/users.repository";
import {
  sendPublishedFicheMailToCreatorService,
  sendPublishedFicheMailToStructureMembersService,
} from "./mail.service";

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
  if (creator.status === UserStatus.DELETED) return;
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
  Promise.all(
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
    }),
  );
