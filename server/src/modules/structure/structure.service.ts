import { ObjectId } from "mongoose";
import logger from "../../logger";
import { getStructureFromDB } from "./structure.repository";
import { Membre } from "../../types/interface";

const isUserRespoOrContrib = (membres: Membre[] | null, userId: ObjectId) => {
  if (!membres) return false;
  const membreInStructure = membres.filter((membre) => {
    return membre.userId && membre.userId.toString() === userId.toString();
  });

  if (membreInStructure.length === 0) return false;
  const roles = membreInStructure[0].roles;
  if (roles.includes("administrateur") || roles.includes("contributeur"))
    return true;

  return false;
};

export const checkIfUserIsAuthorizedToModifyStructure = async (
  structureId: ObjectId,
  requestUserId: ObjectId,
  requestUserRoles: { nom: string }[]
) => {
  logger.info("[checkIfUserIsAuthorizedToModifyStructure] received", {
    id: structureId,
  });
  const fetchedStructure = await getStructureFromDB(structureId, false, {
    membres: 1,
  });
  if (!fetchedStructure) {
    logger.info(
      "[checkIfUserIsAuthorizedToModifyStructure] no structure with this id",
      {
        id: structureId,
      }
    );

    throw new Error("NO_STRUCTURE_WITH_THIS_ID");
  }

  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

  // user is administrateur or contributeur of the structure
  const isUserRespoOrContribBoolean = isUserRespoOrContrib(
    fetchedStructure.membres,
    requestUserId
  );

  if (!isAdmin && !isUserRespoOrContribBoolean) {
    logger.info(
      "[checkIfUserIsAuthorizedToModifyStructure] user not authorized",
      {
        id: structureId,
      }
    );
    throw new Error("USER_NOT_AUTHORIZED");
  }
  return true;
};

export const getStructureMembers = async (structureId: ObjectId) => {
  try {
    const structureNeededFields = { membres: 1 };
    const structure = await getStructureFromDB(
      structureId,
      false,
      structureNeededFields
    );

    if (!structure || !structure.membres || structure.membres.length === 0) {
      return [];
    }
    return structure.membres;
  } catch (e) {
    logger.error("[getStructureMembers] error", e);
  }
};

export const userRespoStructureId = async (structures: ObjectId[], userId: ObjectId) => {
  for (let structureId of structures) {
    const membres = await getStructureMembers(structureId);
    if (!membres) continue;
    const membreInStructure = membres.filter((membre) => {
      return membre.userId && membre.userId.toString() === userId.toString();
    });

    if (membreInStructure.length === 0) continue;
    const roles = membreInStructure[0].roles;
    if (roles.includes("administrateur")) return structureId;

    continue;
  }

  return null;
};
