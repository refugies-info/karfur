import logger from "../../logger";
import {
  getUserById,
  updateUserInDB,
  removeStructureOfAllUsersInDB,
  addStructureForUsersInDB,
  removeStructureOfUserInDB,
  createUser,
} from "./users.repository";
import { asyncForEach } from "../../libs/asyncForEach";
import { User } from "../../typegoose";
import { UserId } from "../../typegoose/User";
import { Membre, StructureId } from "../../typegoose/Structure";
import { RoleName, UserStatus } from "@refugies-info/api-types";
import { getRoleByName } from "../role/role.repository";
import { sendWelcomeMail } from "../mail/mail.service";
import { addLog } from "../logs/logs.service";

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

export const updateLastConnected = (user: User) => updateUserInDB(user._id, { last_connected: new Date() });

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


type RegisterUser = {
  email: string;
  hashedPassword?: string;
  firstName?: string;
  role?: RoleName.CONTRIB | RoleName.TRAD;
}

export const registerUser = async (data: RegisterUser) => {
  const userRole = await getRoleByName(RoleName.USER);
  const extraRole = data.role ? await getRoleByName(data.role) : null;

  const userToSave = {
    email: data.email,
    firstName: data.firstName || null,
    password: data.hashedPassword || null,
    roles: [userRole._id, extraRole?._id].filter(r => !!r),
    status: UserStatus.ACTIVE,
    last_connected: new Date(),
  };
  const user = await createUser(userToSave);

  if (user.email) {
    await sendWelcomeMail(user.email, user.firstName, user._id);
  }

  logger.info("[Register] successfully registered a new user", {
    email: data.email,
  });

  await addLog(user._id, "User", "Utilisateur créé : première connexion");

  return user;
}
