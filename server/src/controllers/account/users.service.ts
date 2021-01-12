import logger from "../../logger";
import {
  getUserById,
  updateUser,
  removeRoleAndStructureInDB,
} from "./users.repository";
import { ObjectId } from "mongoose";
import { getRoleByName } from "../role/role.repository";

const getUserRoles = (roles: ObjectId[] | null, newRole: ObjectId) => {
  if (!roles) return [newRole];

  return roles.filter((role) => role !== newRole).concat([newRole]);
};

export const updateRoleAndStructureOfResponsable = async (
  userId: ObjectId,
  structureId: ObjectId
) => {
  try {
    const user = await getUserById(userId, { roles: 1, structures: 1 });
    const hasStructureRole = await getRoleByName("hasStructure");
    const hasStructureRoleId = hasStructureRole._id;

    const newRole = getUserRoles(user.roles, hasStructureRoleId);
    const newStructures = user.structures
      ? user.structures.concat([structureId])
      : [structureId];
    return await updateUser(userId, {
      roles: newRole,
      structures: newStructures,
    });
  } catch (error) {
    logger.error(
      "[updateRoleAndStructureOfResponsable] error while updating role",
      {
        error,
      }
    );
    throw error;
  }
};

export const removeRoleAndStructureOfUser = async (
  userId: ObjectId,
  structureId: ObjectId
) => {
  logger.info(
    "[removeRoleAndStructureOfUser] delete role hasStructure and structure of membre",
    { membreId: userId }
  );
  const hasStructureRole = await getRoleByName("hasStructure");
  return await removeRoleAndStructureInDB(
    hasStructureRole._id,
    userId,
    structureId
  );
};
