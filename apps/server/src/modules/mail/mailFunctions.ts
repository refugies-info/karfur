import { UserStatus } from "@refugies-info/api-types";
import type { Dispositif, StructureId, User } from "@refugies-info/mongo";
import type { ProjectionType } from "mongoose";
import logger from "~/logger";
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

  const creator = await getUserById(newDispo.creatorId, userNeededFields);
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
      structureId: newDispo.mainSponsor?.toString(),
    });
  }
};

export const sendPublishedMailToStructureMembers = async (
  membres: User[],
  titreInformatif: string,
  titreMarque: string,
  lien: string,
  dispositifId: Dispositif["_id"],
  structureId: StructureId,
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
        structureId,
      });
    }),
  );

export const sendValidatedAndPublishedMail = async (
  membres: User[],
  titreInformatif: string,
  titreMarque: string,
  lien: string,
  structureId?: StructureId,
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
        structureId,
      });
    }),
  );
