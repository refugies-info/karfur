import { UserStatus } from "@refugies-info/api-types";
import type { ProjectionType } from "mongoose";
import logger from "~/logger";
import type { Dispositif } from "~/typegoose";
import type { User } from "~/typegoose/User";
import { getUserById } from "../users/users.repository";
import {
  sendPublishedFicheMailToCreatorService,
  sendPublishedFicheMailToStructureMembersService,
  sendValidatedAndPublishedMailService,
} from "./mail.service";

export const sendPublishedMailToCreator = async (
  newDispo: Dispositif,
  titreInformatif: string,
  titreMarque: string,
  lien: string,
) => {
  const userNeededFields: ProjectionType<User> = {
    firstName: 1,
    email: 1,
    status: 1,
  };

  const creator = await getUserById(newDispo.creatorId._id, userNeededFields);
  if (creator.status === UserStatus.DELETED) return;
  if (creator.email) {
    logger.info("[publish dispositif] creator has email");

    await sendPublishedFicheMailToCreatorService({
      firstName: creator.firstName,
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
      void sendPublishedFicheMailToStructureMembersService({
        firstName: membre.firstName,
        titreInformatif: titreInformatif,
        titreMarque: titreMarque,
        lien,

        email: membre.email,
        dispositifId,
        userId: membre._id,
      });
    }),
  );

export const sendValidatedAndPublishedMail = async (
  membres: User[],
  titreInformatif: string,
  titreMarque: string,
  lien: string,
) =>
  Promise.all(
    membres.map((membre) => {
      logger.info("[sendValidatedAndPublishedMail] send mail to members", {
        membreId: membre._id,
      });
      return sendValidatedAndPublishedMailService({
        userId: membre._id,
        email: membre.email,
        firstName: membre.firstName,
        titreInformatif: titreInformatif,
        titreMarque: titreMarque,
        lien,
      });
    }),
  );
