import { DispositifDoc } from "../schema/schemaDispositif";
import { ObjectId } from "mongoose";
import { StructureDoc } from "../schema/schemaStructure";

export const checkIfUserIsAdmin = (requestUserRoles: { nom: string }[]) => {
  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

  if (!isAdmin) throw new Error("NOT_AUTHORIZED");

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
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");
  if (isAdmin) {
    return true;
  }
  if (
    ["Brouillon", "En attente"].includes(dispositif.status) &&
    dispositif.creatorId.toString() === userId.toString()
  ) {
    return true;
  }

  // @ts-ignore
  const sponsor: StructureDoc = dispositif.mainSponsor;

  const isUserMembre =
    sponsor.membres.map(
      (membre) =>
        membre.userId && membre.userId.toString() === userId.toString()
    ).length > 0;
  if (isUserMembre) return true;

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
  return;
};
