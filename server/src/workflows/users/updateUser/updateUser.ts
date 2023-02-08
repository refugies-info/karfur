import { Types } from "mongoose";
import logger from "../../../logger";
import { RequestFromClient, Res, Picture, SelectedLanguage } from "../../../types/interface";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { sendResetPhoneNumberMail } from "../../../modules/mail/mail.service";
import { requestSMSLogin, verifyCode } from "../../../modules/users/login2FA";
import formatPhoneNumber from "../../../libs/formatPhoneNumber";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { loginExceptionsManager } from "../login/login.exceptions.manager";
import { log } from "./log";

export interface User {
  _id: Types.ObjectId;
  roles: string[];
  email?: string;
  phone?: string;
  code?: string;
  username?: string;
  picture?: Picture;
  adminComments?: string;
  selectedLanguages?: SelectedLanguage[];
}

interface Data {
  user: User;
  action: "modify-with-roles" | "modify-my-details";
}
export const updateUser = async (req: RequestFromClient<Data>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    const { user, action } = req.body.query;
    if (!user || !user._id) {
      throw new Error("INVALID_REQUEST");
    }

    logger.info("[updateUser] call received", { user, action });
    const userFromDB = await getUserById(user._id, { username: 1, phone: 1, email: 1, roles: 1 });

    if (user.phone) {
      // format phone
      user.phone = formatPhoneNumber(user.phone);
    }

    if (action === "modify-with-roles") {
      const isRequestorAdmin = req.user.hasRole("Admin");
      if (!isRequestorAdmin) {
        throw new Error("USER_NOT_AUTHORIZED");
      }
      const expertRole = await getRoleByName("ExpertTrad");
      const adminRole = await getRoleByName("Admin");
      const actualRoles = userFromDB.roles;

      let newRoles = actualRoles.filter(
        (role) => role && role.toString() !== adminRole._id.toString() && role.toString() !== expertRole._id.toString()
      );

      // add role admin
      if (user.roles.includes("Admin")) {
        newRoles.push(adminRole._id);
      }
      // add role expert
      if (user.roles.includes("ExpertTrad")) {
        newRoles.push(expertRole._id);
      }

      await updateUserInDB(user._id, {
        email: user.email,
        phone: user.phone,
        roles: newRoles,
        adminComments: user.adminComments
      });
      user.username = userFromDB.username; // populate username for log

      if (userFromDB.phone !== user.phone) {
        // if phone changed, send mail
        await sendResetPhoneNumberMail(userFromDB.username, user.email);
      }
    }

    if (action === "modify-my-details") {
      if (user._id.toString() !== req.userId.toString()) {
        throw new Error("USER_NOT_AUTHORIZED");
      }
      try {
        delete user.roles; // for security purposes, do not use roles sent by the client
        if (user.selectedLanguages) {
          const traducteurRole = await getRoleByName("Trad");
          const actualRoles = userFromDB.roles;
          const hasAlreadyRoleTrad = !!actualRoles.find(
            (role) => role && role.toString() === traducteurRole._id.toString()
          );
          if (hasAlreadyRoleTrad) {
            await updateUserInDB(user._id, user);
          } else {
            const newRoles = actualRoles.concat(traducteurRole._id);
            await updateUserInDB(user._id, { ...user, roles: newRoles });
          }
        } else if (user.phone) {
          // update phone number with 2FA
          try {
            if (!user.code) await requestSMSLogin(user.phone);
            await verifyCode(user.phone, user.code);
            delete user.code;
            await updateUserInDB(user._id, user);
          } catch (e) {
            return loginExceptionsManager(e, res);
          }
        } else {
          await updateUserInDB(user._id, user);
        }
        // populate user for logs
        if (!user.email) user.email = userFromDB.email;
        if (!user.phone) user.phone = userFromDB.phone;
        if (!user.username) user.username = userFromDB.username;
      } catch (error) {
        if (user.username !== req.user.username) {
          throw new Error("PSEUDO_ALREADY_EXISTS");
        }
        throw error;
      }
    }
    await log(user, userFromDB, req.user._id);

    return res.status(200).json({
      text: "OK"
    });
  } catch (error) {
    logger.error("[updateUser] error", {
      error: error.message
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "USER_NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "PSEUDO_ALREADY_EXISTS":
        return res.status(401).json({ text: "Ce pseudo est déjà pris" });

      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
