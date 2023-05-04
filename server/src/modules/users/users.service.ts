import logger from "../../logger";
import {
  getUserById,
  updateUserInDB,
  removeStructureOfAllUsersInDB,
  addStructureForUsersInDB,
  removeStructureOfUserInDB,
} from "./users.repository";
import { asyncForEach } from "../../libs/asyncForEach";
import { User } from "../../typegoose";
import { UserId } from "../../typegoose/User";
import { Membre, StructureId } from "../../typegoose/Structure";
import { UserStatus } from "@refugies-info/api-types";

export const addStructureForUsers = async (userIds: UserId[], structureId: StructureId) => {
  logger.info("[addStructure] add structure for membres", { userIds, structureId });
  return addStructureForUsersInDB(userIds, structureId).catch((error) => {
    logger.error("[addStructure] error while updating role", {
      error,
    });
    throw error;
  });
};

export const removeStructureOfAllUsers = async (structureId: StructureId) => {
  logger.info("[removeStructureOfUser] delete structure for all users", { structureId });
  return removeStructureOfAllUsersInDB(structureId).catch((error) => {
    logger.error("[removeStructureOfUser] error while updating role", {
      error,
    });
    throw error;
  });
};

export const removeStructureOfUser = async (userId: UserId, structureId: StructureId) => {
  logger.info("[removeStructureOfUser] delete structure for user", { userId, structureId });
  return removeStructureOfUserInDB(userId, structureId).catch((error) => {
    logger.error("[removeStructureOfUser] error while updating role", {
      error,
    });
    throw error;
  });
};

export const proceedWithLogin = (user: User) => updateUserInDB(user._id, { last_connected: new Date() });

export const getUsersFromStructureMembres = async (structureMembres: Membre[]): Promise<User[]> => {
  logger.info("[getUsersFromStructureMembres] received");
  let result: User[] = [];
  try {
    const userNeededFields = {
      username: 1,
      email: 1,
      status: 1,
    };
    await asyncForEach(structureMembres, async (membre) => {
      if (!membre.userId) return;

      try {
        const membreFromDB = await getUserById(membre.userId.toString(), userNeededFields);
        if (membreFromDB.status === UserStatus.DELETED) return;
        if (!membreFromDB.email) return;
        result.push(membreFromDB);
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
