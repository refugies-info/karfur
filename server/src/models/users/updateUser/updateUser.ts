import { RequestFromClient, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import logger = require("../../../logger");
import { getRoleByName } from "../../../controllers/role/role.repository";
import { RoleInstance } from "twilio/lib/rest/chat/v1/service/role";
import { getUserById, updateUserInDB } from "../users.repository";

interface User {
  _id: ObjectId;
  roles: string[];
  email: string;
}

interface Data {
  user: User;
  action: "modify" | "delete";
}
export const updateUser = async (req: RequestFromClient<Data>, res: Res) => {
  try {
    const { user, action } = req.body.query;
    if (!user || !user._id) {
      throw new Error("INVALID_REQUEST");
    }

    logger.info("[updateUser] call received", { user, action });

    if (action === "modify") {
      // @ts-ignore
      const isRequestorAdmin = req.user.roles.find((x) => x.nom === "Admin");
      if (!isRequestorAdmin) {
        throw new Error("USER_NOT_AUTHORIZED");
      }

      const expertRole = await getRoleByName("ExpertTrad");
      const adminRole = await getRoleByName("Admin");
      const userFromDB = await getUserById(user._id, { roles: 1 });
      const actualRoles = userFromDB.roles;

      let newRoles = actualRoles.filter(
        (role) =>
          role &&
          role.toString() !== adminRole._id.toString() &&
          role.toString() !== expertRole._id.toString()
      );

      // add role admin
      if (user.roles.includes("Admin")) {
        newRoles.push(adminRole._id);
      }
      // add role expert
      if (user.roles.includes("ExpertTrad")) {
        newRoles.push(expertRole._id);
      }

      await updateUserInDB(user._id, { email: user.email, roles: newRoles });
    }

    if (action === "delete") {
      await updateUserInDB(user._id, { status: "Exclu" });
    }

    return res.status(200).json({
      text: "OK",
    });
  } catch (error) {
    logger.error("[updateUser] error", {
      error,
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "USER_NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
