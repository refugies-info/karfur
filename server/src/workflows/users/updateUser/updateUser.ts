import logger from "../../../logger";
import { getRoles } from "../../../modules/role/role.repository";
import { getUserById, getUserFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { sendResetPhoneNumberMail } from "../../../modules/mail/mail.service";
import { requestEmailLogin, verifyCode } from "../../../modules/users/login2FA";
import { loginExceptionsManager } from "../../../modules/users/auth";
import formatPhoneNumber from "../../../libs/formatPhoneNumber";
import { log } from "./log";
import { ObjectId, User } from "../../../typegoose";
import { UnauthorizedError } from "../../../errors";
import { Response } from "../../../types/interface";
import { RoleName, UpdateUserRequest } from "@refugies-info/api-types";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";
import uniq from "lodash/uniq";

export const updateUser = async (id: string, body: UpdateUserRequest, userReq: User): Response => {
  const { action } = body;
  const user: Partial<User> = {
    email: body.user.email,
    phone: body.user.phone,
    username: body.user.username,
    picture: body.user.picture,
    adminComments: body.user.adminComments,
    selectedLanguages: (body.user.selectedLanguages || []).map(r => new ObjectId(r)),
    // TODO: missing partner? or departments?
  }
  logger.info("[updateUser] call received", { user, action });
  const userFromDB = await getUserById(id, { username: 1, phone: 1, email: 1, roles: 1 });
  const roles = await getRoles();

  if (user.phone) {
    // format phone
    user.phone = formatPhoneNumber(user.phone);
  }

  if (action === "modify-with-roles") {
    const isRequestorAdmin = userReq.isAdmin();
    if (!isRequestorAdmin) {
      throw new UnauthorizedError("Token invalide");
    }
    const expertRole = roles.find(r => r.nom === RoleName.EXPERT_TRAD);
    const adminRole = roles.find(r => r.nom === RoleName.ADMIN);
    const actualRoles = userFromDB.roles;

    let newRoles = actualRoles.filter(
      (role) => role && role.toString() !== adminRole._id.toString() && role.toString() !== expertRole._id.toString(),
    );

    // add role admin
    if (body.user.roles.includes(RoleName.ADMIN)) {
      newRoles.push(adminRole._id);
    }
    // add role expert
    if (body.user.roles.includes(RoleName.EXPERT_TRAD)) {
      newRoles.push(expertRole._id);
    }

    await updateUserInDB(id, {
      email: user.email,
      phone: user.phone,
      roles: newRoles,
      adminComments: user.adminComments,
    });
    user.username = userFromDB.username; // populate username for log

    if (userFromDB.phone !== user.phone) {
      // if phone changed, send mail
      await sendResetPhoneNumberMail(userFromDB.username, user.email);
    }
  }

  if (action === "modify-my-details") {
    if (id !== userReq._id.toString()) throw new UnauthorizedError("Token invalide"); // only my infos

    if (body.user.selectedLanguages) {
      const traducteurRole = roles.find(r => r.nom === RoleName.TRAD);
      const newRoles = uniq([...userFromDB.roles, traducteurRole._id]); // TODO: test
      await updateUserInDB(id, { ...user, roles: newRoles });
    } else if (body.user.email) {
      try {
        if (!body.user.code) {
          await requestEmailLogin(user.email);
          throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED);
        }
        await verifyCode(user.email, body.user.code);
        await updateUserInDB(id, user);
      } catch (e) {
        loginExceptionsManager(e);
      }
    } else if (body.user.username) {
      const userHasUsername = await getUserFromDB({ username: body.user.username });
      if (userHasUsername && userHasUsername._id.toString() !== id) {
        throw new UnauthorizedError("Username déjà pris", "USERNAME_TAKEN");
      }
      await updateUserInDB(id, { username: body.user.username });
    } else if (body.user.roles) {
      const newRoles = body.user.roles
        .filter(r => [RoleName.CONTRIB, RoleName.TRAD].includes(r)) // only these roles allowed
        .map(r => roles.find(role => role.nom === r)?._id)
        .filter(r => !!r);
      await updateUserInDB(id, { roles: uniq([...userFromDB.roles, ...newRoles]) });
    } else if (body.user.partner) {
      await updateUserInDB(id, { partner: body.user.partner });
    } else if (body.user.departments) {
      await updateUserInDB(id, { departments: body.user.departments });
    } else {
      await updateUserInDB(id, user); // TODO: check if used
    }
    // populate user for logs
    if (!user.email) user.email = userFromDB.email;
    if (!user.phone) user.phone = userFromDB.phone;
    if (!user.username) user.username = userFromDB.username;

  }
  await log(id, body.user, userFromDB, userReq._id);

  return { text: "success" };
};
