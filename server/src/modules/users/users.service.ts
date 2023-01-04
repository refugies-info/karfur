import logger from "../../logger";
import {
  getUserById,
  updateUserInDB,
  removeStructureOfAllUsersInDB,
  addStructureForUsersInDB,
  removeStructureOfUserInDB
} from "./users.repository";
import { ObjectId } from "mongoose";
import { UserDoc, USER_STATUS_DELETED } from "../../schema/schemaUser";
import { asyncForEach } from "../../libs/asyncForEach";
import { UserForMailing } from "../../types/interface";

export const addStructureForUsers = async (userIds: ObjectId[], structureId: ObjectId) => {
  logger.info("[addStructure] add structure for membres", { userIds, structureId });
  return addStructureForUsersInDB(userIds, structureId).catch((error) => {
    logger.error("[addStructure] error while updating role", {
      error
    });
    throw error;
  });
};

export const removeStructureOfAllUsers = async (structureId: ObjectId) => {
  logger.info("[removeStructureOfUser] delete structure for all users", { structureId });
  return removeStructureOfAllUsersInDB(structureId).catch((error) => {
    logger.error("[removeStructureOfUser] error while updating role", {
      error
    });
    throw error;
  });
};

export const removeStructureOfUser = async (userId: ObjectId, structureId: ObjectId) => {
  logger.info("[removeStructureOfUser] delete structure for user", { userId, structureId });
  return removeStructureOfUserInDB(userId, structureId).catch((error) => {
    logger.error("[removeStructureOfUser] error while updating role", {
      error
    });
    throw error;
  });
};

export const proceedWithLogin = async (user: UserDoc) => {
  const userToSave = { last_connected: new Date() };
  return await updateUserInDB(user._id, userToSave);
};

export const getUsersFromStructureMembres = async (structureMembres: { userId: ObjectId }[]) => {
  logger.info("[getUsersFromStructureMembres] received");
  let result: UserForMailing[] = [];
  try {
    const userNeededFields = {
      username: 1,
      email: 1,
      status: 1
    };
    await asyncForEach(structureMembres, async (membre) => {
      if (!membre.userId) return;

      try {
        const membreFromDB = await getUserById(membre.userId, userNeededFields);
        if (membreFromDB.status === USER_STATUS_DELETED) return;
        if (!membreFromDB.email) return;
        result.push({
          username: membreFromDB.username,
          _id: membreFromDB._id,
          email: membreFromDB.email
        });
      } catch (e) {
        logger.error("[getUsersFromStructureMembres] error while getting user", e);
      }
    });

    return result;
  } catch (e) {
    logger.info("[getUsersFromStructureMembres] error", e);
    return result;
  }
};
