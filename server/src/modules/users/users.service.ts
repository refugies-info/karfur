import logger from "../../logger";
import {
  getUserById,
  updateUserInDB,
  removeRoleAndStructureInDB,
} from "./users.repository";
import { ObjectId } from "mongoose";
import { getRoleByName } from "../../controllers/role/role.repository";
import { UserDoc } from "../../schema/schemaUser";

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
    return await updateUserInDB(userId, {
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

export const proceedWithLogin = async (user: UserDoc) => {
  const userToSave = { last_connected: new Date() };
  return await updateUserInDB(user._id, userToSave);
};
