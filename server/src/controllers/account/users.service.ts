import { Res } from "../../types/interface";
import { User } from "../../schema/schemaUser";
import logger from "../../logger";
import {
  getUserById,
  updateUser,
  removeRoleAndStructureInDB,
} from "./users.repository";
import { ObjectId } from "mongoose";
import { getRoleByName } from "../role/role.repository";

export const getFiguresOnUsers = async (req: {}, res: Res) => {
  try {
    const users = await User.find({ status: "Actif" }, { roles: 1 }).populate(
      "roles"
    );
    const nbContributors = users.filter((x: any) =>
      (x.roles || []).some((y: any) => y && y.nom === "Contrib")
    ).length;
    const nbTraductors = users.filter((x: any) =>
      (x.roles || []).some(
        (y: any) => y.nom === "Trad" || y.nom === "ExpertTrad"
      )
    ).length;
    const nbExperts = users.filter((x: any) =>
      (x.roles || []).some((y: any) => y.nom === "ExpertTrad")
    ).length;

    res.status(200).json({
      data: {
        nbContributors,
        nbTraductors,
        nbExperts,
      },
    });
  } catch (error) {
    logger.error("[getFiguresOnUsers] error while getting users", { error });
    res.status(200).json({
      data: {
        nbContributors: 0,
        nbTraductors: 0,
        nbExperts: 0,
      },
    });
  }
};

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
