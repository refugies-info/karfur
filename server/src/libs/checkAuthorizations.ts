import { Dispositif, Structure, User } from "../typegoose";
import logger from "../logger";
import { UnauthorizedError } from "../errors";
import { DispositifStatus } from "@refugies-info/api-types";

// Dispositif edition
export const isUserAuthorizedToModifyDispositif = (dispositif: Dispositif, user: User, hasDraftVersion: boolean) => {
  logger.info("[isUserAuthorizedToModifyDispositif] received");
  if (user.isAdmin()) {
    logger.info("[isUserAuthorizedToModifyDispositif] user is admin");
    return true;
  }

  // only author can moodify
  const firstDraftVersion = dispositif.status === DispositifStatus.DRAFT && !hasDraftVersion; // the never published draft
  const onlyAuthorCanModify = [ // or waiting content
    DispositifStatus.WAITING_STRUCTURE,
    DispositifStatus.KO_STRUCTURE,
  ];
  const isOnlyEditableByAuthor = firstDraftVersion || onlyAuthorCanModify.includes(dispositif.status);
  const isAuthor = dispositif.creatorId.toString() === user._id.toString();
  if (isOnlyEditableByAuthor) {
    if (isAuthor) {
      logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is author`);
      return true;
    }

    logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} but user is not author`);
    return false;
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

export const checkUserIsAuthorizedToModifyDispositif = (dispositif: Dispositif, user: User, hasDraftVersion: boolean): boolean => {
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

  const sponsor: Structure = dispositif.getMainSponsor();
  const userInStructure = sponsor && sponsor.membres.find((membre) => membre.userId?.toString() === user.id);
  if (!userInStructure) return false; // user not in structure

  // user is responsable of structure
  if (userInStructure.roles.includes("administrateur")) {
    return true;
  }

  // user is redacteur of structure and author
  const isAuthor = dispositif.creatorId.toString() === user.id;
  if (userInStructure.roles.includes("contributeur") && isAuthor) {
    return true;
  }

  return false;
};

export const checkUserIsAuthorizedToDeleteDispositif = (dispositif: Dispositif, user: User) => {
  if (!isUserAuthorizedToDeleteDispositif(dispositif, user)) {
    throw new Error("NOT_AUTHORIZED");
  }
  return true;
};
