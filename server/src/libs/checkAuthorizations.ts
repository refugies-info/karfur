import { Dispositif, Structure, User } from "../typegoose";
import logger from "../logger";

// Dispositif edition
export const isUserAuthorizedToModifyDispositif = (dispositif: Dispositif, user: User) => {
  logger.info("[isUserAuthorizedToModifyDispositif] received");
  if (user.isAdmin()) {
    logger.info("[isUserAuthorizedToModifyDispositif] user is admin");
    return true;
  }

  const authorCanModifyStatusList = ["Brouillon", "En attente", "Rejeté structure", "En attente non prioritaire"];
  if (
    authorCanModifyStatusList.includes(dispositif.status) &&
    dispositif.creatorId.toString() === user._id.toString()
  ) {
    logger.info(`[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is author`);
    return true;
  }

  if (authorCanModifyStatusList.includes(dispositif.status)) {
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

export const checkUserIsAuthorizedToModifyDispositif = (dispositif: Dispositif, user: User): boolean => {
  if (!isUserAuthorizedToModifyDispositif(dispositif, user)) {
    throw new Error("NOT_AUTHORIZED");
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
