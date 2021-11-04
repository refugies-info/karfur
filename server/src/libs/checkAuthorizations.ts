import { DispositifDoc } from "../schema/schemaDispositif";
import { ObjectId } from "mongoose";
import { StructureDoc } from "../schema/schemaStructure";
import logger from "../logger";

export const checkIfUserIsAdmin = (requestUserRoles: { nom: string }[]) => {
  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

  if (!isAdmin) throw new Error("NOT_AUTHORIZED");

  return;
};

export const checkIfUserIsAdminOrExpert = (
  requestUserRoles: { nom: string }[]
) => {
  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");
  const isExpert = (requestUserRoles || []).some((x) => x.nom === "ExpertTrad");

  if (!isAdmin && !isExpert) throw new Error("NOT_AUTHORIZED");

  return;
};

export const checkRequestIsFromSite = (fromSite: boolean) => {
  if (!fromSite) throw new Error("NOT_FROM_SITE");

  return;
};

export const checkRequestIsFromPostman = (fromPostman: boolean) => {
  if (!fromPostman) throw new Error("NOT_AUTHORIZED");

  return;
};

export const checkCronAuthorization = (cronToken: string) => {
  if (!cronToken || process.env.CRON_TOKEN !== cronToken) {
    throw new Error("NOT_AUTHORIZED");
  }
  return;
};

const isUserAuthorizedToModifyDispositif = (
  dispositif: DispositifDoc,
  userId: ObjectId,
  requestUserRoles: { nom: string }[]
) => {
  logger.info("[isUserAuthorizedToModifyDispositif] received");
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");
  if (isAdmin) {
    logger.info("[isUserAuthorizedToModifyDispositif] user is admin");
    return true;
  }

  const authorCanModifyStatusList = [
    "Brouillon",
    "En attente",
    "Rejeté structure",
    "En attente non prioritaire",
  ];
  if (
    authorCanModifyStatusList.includes(dispositif.status) &&
    dispositif.creatorId.toString() === userId.toString()
  ) {
    logger.info(
      `[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is author`
    );
    return true;
  }

  if (authorCanModifyStatusList.includes(dispositif.status)) {
    logger.info(
      `[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} but user is not author`
    );

    return false;
  }

  // @ts-ignore
  const sponsor: StructureDoc = dispositif.mainSponsor;

  const isUserMembre =
    sponsor && sponsor.membres.filter(
      (membre) =>
        membre.userId && membre.userId.toString() === userId.toString()
    ).length > 0;
  if (isUserMembre) {
    logger.info(
      `[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is in structure`
    );
    return true;
  }
  logger.info(
    `[isUserAuthorizedToModifyDispositif] status is ${dispositif.status} and user is not in structure`
  );

  return false;
};

export const checkUserIsAuthorizedToModifyDispositif = (
  dispositif: DispositifDoc,
  userId: ObjectId,
  requestUserRoles: { nom: string }[]
) => {
  if (
    !isUserAuthorizedToModifyDispositif(dispositif, userId, requestUserRoles)
  ) {
    throw new Error("NOT_AUTHORIZED");
  }
  return true;
};
