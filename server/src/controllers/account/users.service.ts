import { Res } from "../../types/interface";
import { User } from "../../schema/schemaUser";
import logger from "../../logger";
import { getAllUsersFromDB, getUserById, updateUser } from "./users.repository";
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

export const getAllUsers = async (_: any, res: Res) => {
  try {
    const users = await getAllUsersFromDB();

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({ text: "Erreur interne" });
  }
};

export const updateRoleOfResponsable = async (userId: ObjectId) => {
  try {
    const user = await getUserById(userId, { roles: 1 });
    const hasStructureRole = await getRoleByName("hasStructure");
    const hasStructureRoleId = hasStructureRole._id;

    if (user.roles && user.roles.includes(hasStructureRoleId)) {
      // user already has hasStructure role
      return;
    }
    const newRole = user.roles.concat([hasStructureRoleId]);
    return await updateUser(userId, { roles: newRole });
  } catch (error) {
    logger.error("[updateRoleOfResponsable] error while updating role", {
      error,
    });
    throw error;
  }
};
