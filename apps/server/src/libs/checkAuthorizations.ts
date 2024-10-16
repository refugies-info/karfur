import { DispositifStatus } from "@refugies-info/api-types";
import { UnauthorizedError } from "~/errors";
import logger from "~/logger";
import { Dispositif, Structure, User } from "~/typegoose";

// Dispositif edition
export const isUserAuthorizedToModifyDispositif = (dispositif: Dispositif, user: User, hasDraftVersion: boolean) => {
  logger.info("[isUserAuthorizedToModifyDispositif] received");
  if (user.isAdmin()) {
    logger.info("[isUserAuthorizedToModifyDispositif] user is admin");
    return true;
  }

  // author can modify
  const firstDraftVersion = dispositif.status === DispositifStatus.DRAFT && !hasDraftVersion; // the never published draft
  const authorCanModify = [
    // or waiting content
    DispositifStatus.WAITING_STRUCTURE,
    DispositifStatus.KO_STRUCTURE,
  ];
  const isEditableByAuthor = firstDraftVersion || authorCanModify.includes(dispositif.status);
  const isAuthor = dispositif.creatorId.toString() === user._id.toString();
  if (isEditableByAuthor && isAuthor) {
    logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is author`);
    return true;
  }

  const sponsor: Structure | null = dispositif.mainSponsor ? dispositif.getMainSponsor() : null;

  const isUserMembre =
    sponsor &&
    sponsor.membres.filter((membre) => membre.userId && membre.userId.toString() === user._id.toString()).length > 0;
  if (isUserMembre) {
    logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is in structure`);
    return true;
  }
  logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is not in structure`);

  return false;
};

export const checkUserIsAuthorizedToModifyDispositif = (
  dispositif: Dispositif,
  user: User,
  hasDraftVersion: boolean,
): boolean => {
  if (!isUserAuthorizedToModifyDispositif(dispositif, user, hasDraftVersion)) {
    throw new UnauthorizedError("The user is not authorized to edit content");
  }
  return true;
};

// Dispositif deletion
const isUserAuthorizedToDeleteDispositif = (dispositif: Dispositif, user: User) => {
  logger.info("[isUserAuthorizedToDeleteDispositif] received");
  // user is admin
  const isAdmin = user.isAdmin();
  if (isAdmin) {
    logger.info("[isUserAuthorizedToDeleteDispositif] user is admin");
    return true;
  }
  const isAuthor = dispositif.creatorId.toString() === user.id;

  const sponsor: Structure | null = dispositif.mainSponsor ? dispositif.getMainSponsor() : null;
  if (!sponsor && isAuthor) return true; // no sponsor yet, but user is author

  const userInStructure = sponsor && sponsor.membres.find((membre) => membre.userId?.toString() === user.id);
  if (sponsor && !userInStructure) return false; // user not in structure

  // user is responsable of structure
  return true;
};

export const checkUserIsAuthorizedToDeleteDispositif = (dispositif: Dispositif, user: User) => {
  if (!isUserAuthorizedToDeleteDispositif(dispositif, user)) {
    throw new Error("NOT_AUTHORIZED");
  }
  return true;
};
