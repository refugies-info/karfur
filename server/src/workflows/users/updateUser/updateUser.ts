import logger from "../../../logger";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { sendResetPhoneNumberMail } from "../../../modules/mail/mail.service";
import { requestSMSLogin, verifyCode } from "../../../modules/users/login2FA";
import formatPhoneNumber from "../../../libs/formatPhoneNumber";
import { loginExceptionsManager } from "../login/login.exceptions.manager";
import { log } from "./log";
import { UpdateUserRequest } from "../../../controllers/userController";
import { User } from "../../../typegoose";
import { UnauthorizedError } from "../../../errors";
import { Response } from "../../../types/interface";

export const updateUser = async (id: string, body: UpdateUserRequest, userReq: User): Response => {
  const { user, action } = body;
  logger.info("[updateUser] call received", { user, action });
  const userFromDB = await getUserById(id, { username: 1, phone: 1, email: 1, roles: 1 });

  if (user.phone) {
    // format phone
    user.phone = formatPhoneNumber(user.phone);
  }

  if (action === "modify-with-roles") {
    const isRequestorAdmin = userReq.isAdmin();
    if (!isRequestorAdmin) {
      throw new UnauthorizedError("Token invalide");
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

    await updateUserInDB(id, {
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
    if (id !== userReq._id.toString()) {
      throw new UnauthorizedError("Token invalide");
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
          await updateUserInDB(id, user);
        } else {
          const newRoles = actualRoles.concat(traducteurRole._id);
          await updateUserInDB(id, { ...user, roles: newRoles });
        }
      } else if (user.phone) {
        // update phone number with 2FA
        try {
          if (!user.code) await requestSMSLogin(user.phone);
          await verifyCode(user.phone, user.code);
          delete user.code;
          await updateUserInDB(id, user);
        } catch (e) {
          loginExceptionsManager(e);
        }
      } else {
        await updateUserInDB(id, user);
      }
      // populate user for logs
      if (!user.email) user.email = userFromDB.email;
      if (!user.phone) user.phone = userFromDB.phone;
      if (!user.username) user.username = userFromDB.username;
    } catch (error) {
      if (user.username !== userReq.username) {
        throw new UnauthorizedError("Ce pseudo est déjà pris");
      }
      throw error;
    }
  }
  await log(id, user, userFromDB, userReq._id);

  return { text: "success" }
};
