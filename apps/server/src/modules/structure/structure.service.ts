import logger from "../../logger";
import { getStructureFromDB } from "./structure.repository";
import { Structure, User, UserId } from "../../typegoose";
import { Membre, StructureId } from "../../typegoose/Structure";
import { StructureMemberRole } from "@refugies-info/api-types";

const isUserRespoOrContrib = (membres: Membre[] | null, userId: UserId) => {
  if (!membres) return false;
  const membreInStructure = membres.filter((membre) => {
    return membre.userId && membre.userId.toString() === userId.toString();
  });

  if (membreInStructure.length === 0) return false;
  const roles = membreInStructure[0].roles;
  return roles.includes(StructureMemberRole.ADMIN) || roles.includes(StructureMemberRole.CONTRIB);
};

export const checkIfUserIsAuthorizedToModifyStructure = async (structureId: StructureId, currentUser: User) => {
  logger.info("[checkIfUserIsAuthorizedToModifyStructure] received", {
    id: structureId
  });
  const fetchedStructure = await getStructureFromDB(structureId, { membres: 1 });
  if (!fetchedStructure) {
    logger.info("[checkIfUserIsAuthorizedToModifyStructure] no structure with this id", {
      id: structureId
    });

    throw new Error("NO_STRUCTURE_WITH_THIS_ID");
  }

  // user is administrateur or contributeur of the structure
  const isUserRespoOrContribBoolean = isUserRespoOrContrib(fetchedStructure.membres, currentUser._id);

  if (!currentUser.isAdmin() && !isUserRespoOrContribBoolean) {
    logger.info("[checkIfUserIsAuthorizedToModifyStructure] user not authorized", {
      id: structureId
    });
    throw new Error("USER_NOT_AUTHORIZED");
  }
  return true;
};

export const getStructureMembers = async (structureId: StructureId) => {
  try {
    const structure = await getStructureFromDB(structureId, { membres: 1 });
    if (!structure || !structure.membres || structure.membres.length === 0) {
      return [];
    }
    return structure.membres;
  } catch (e) {
    logger.error("[getStructureMembers] error", e);
  }
};

/**
 * Cette fonction renvoie l'identifiant de la première structure
 * de laquelle l'utlisateur est administrateur.
 * Si il n'est administrateur d'aucune structure, la fonction renvoie null
 *
 * @param structures
 * @param userId
 * @returns
 */
export const userRespoStructureId = async (structures: StructureId[], userId: UserId): Promise<StructureId | null> => {
  for (let structureId of structures) {
    const membres = await getStructureMembers(structureId);
    if (!membres) continue;
    const membreInStructure = membres.filter((membre) => {
      return membre.userId && membre.userId.toString() === userId.toString();
    });

    if (membreInStructure.length === 0) continue;
    const roles = membreInStructure[0].roles;
    if (roles.includes(StructureMemberRole.ADMIN)) return structureId;

    continue;
  }

  return null;
};

export const findAllRespo = (structures: Structure[]) => {
  const userIds: UserId[] = [];

  for (const structure of structures) {
    if (!structure.membres) continue;
    const admins = structure.membres
      .filter((m: Membre) => m.roles.includes(StructureMemberRole.ADMIN))
      .map((m) => m.userId.toString());
    userIds.push(...admins);
  }

  return [...new Set(userIds)];
};
