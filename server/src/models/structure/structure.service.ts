import { ObjectId } from "mongoose";
import logger = require("../../logger");
import { getStructureFromDB } from "./structure.repository";
import { Membre } from "../../types/interface";

const isUserRespoOrContrib = (membres: Membre[] | null, userId: ObjectId) => {
  if (!membres) return false;
  const membreInStructure = membres.filter((membre) => {
    return membre.userId.toString() === userId.toString();
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
  const fetchedStructure = await getStructureFromDB(structureId, false, {
    membres: 1,
  });
  if (!fetchedStructure) {
    logger.info("[updateStructure] no structure with this id", {
      id: structureId,
    });

    throw new Error("NO_STRUCTURE_WITH_THIS_ID");
  }

  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

  // user is administrateur or contributeur of the structure
  const isUserRespoOrContribBoolean = isUserRespoOrContrib(
    fetchedStructure.membres,
    requestUserId
  );

  if (!isAdmin && !isUserRespoOrContribBoolean)
    throw new Error("USER_NOT_AUTHORIZED");
};
