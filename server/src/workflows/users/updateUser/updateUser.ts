import { DocumentType } from "@typegoose/typegoose";
import { RoleName, UpdateUserRequest } from "@refugies-info/api-types";
import isUndefined from "lodash/isUndefined";
import omitBy from "lodash/omitBy";
import logger from "../../../logger";
import { getRoles } from "../../../modules/role/role.repository";
import { getUserById, getUserFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { requestEmailLogin, verifyCode } from "../../../modules/users/login2FA";
import { loginExceptionsManager } from "../../../modules/users/auth";
import { uniqIds } from "../../../libs/uniqIds";
import formatPhoneNumber from "../../../libs/formatPhoneNumber";
import { log } from "./log";
import { ObjectId, User } from "../../../typegoose";
import { UnauthorizedError } from "../../../errors";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";
import { changePassword } from "../changePassword";

const updateAsAdmin = async (request: UpdateUserRequest["user"], userFromDB: DocumentType<User>, userReq: User) => {
  const roles = await getRoles();
  let newUser: Partial<User> = {}
  const isRequestorAdmin = userReq.isAdmin();
  if (!isRequestorAdmin) {
    throw new UnauthorizedError("Token invalide");
  }
  newUser = {
    email: request.email,
    phone: formatPhoneNumber(request.phone),
    adminComments: request.adminComments,
  };
  const expertRole = roles.find(r => r.nom === RoleName.EXPERT_TRAD);
  const adminRole = roles.find(r => r.nom === RoleName.ADMIN);
  const currentRoles = userFromDB.roles;

  let newRoles = currentRoles.filter(
    (role) => role && role.toString() !== adminRole._id.toString() && role.toString() !== expertRole._id.toString(),
  );

  // add role admin
  if (request.roles.includes(RoleName.ADMIN)) {
    newRoles.push(adminRole._id);
  }
  // add role expert
  if (request.roles.includes(RoleName.EXPERT_TRAD)) {
    newRoles.push(expertRole._id);
  }

  newUser.roles = newRoles;

  return newUser;
}

const updateAsMyself = async (id: string, request: UpdateUserRequest["user"], userFromDB: DocumentType<User>, userReq: User): Promise<{ newUser: Partial<User>, refreshToken: boolean }> => {
  const roles = await getRoles();
  let newUser: Partial<User> = {};
  let refreshToken = false;
  if (id !== userReq._id.toString()) throw new UnauthorizedError("Token invalide"); // only my infos

  newUser = {
    partner: request.partner,
    departments: request.departments,
    phone: request.phone ? formatPhoneNumber(request.phone) : undefined,
    picture: request.picture,
    firstName: request.firstName,
  };

  if (request.password) {
    const newHashedPassword = await changePassword(id, request.password.oldPassword || "", request.password.newPassword || "");
    newUser.password = newHashedPassword;
    if (!refreshToken) refreshToken = true;
  }
  if (request.selectedLanguages) {
    const traducteurRole = roles.find(r => r.nom === RoleName.TRAD);
    const newRoles = uniqIds([...userFromDB.roles, traducteurRole._id]);
    newUser.roles = newRoles;
    newUser.selectedLanguages = request.selectedLanguages.map(ln => new ObjectId(ln));
  }
  if (request.partner) {
    const caregiverRole = roles.find(r => r.nom === RoleName.CAREGIVER);
    const newRoles = uniqIds([...userFromDB.roles, caregiverRole._id]);
    newUser.roles = newRoles;
  }
  if (request.username !== undefined) {
    if (request.username !== "") {
      const userHasUsername = await getUserFromDB({ username: request.username });
      if (userHasUsername && userHasUsername._id.toString() !== id) {
        throw new UnauthorizedError("Username déjà pris", "USERNAME_TAKEN");
      }
      newUser.username = request.username;
      if (!refreshToken) refreshToken = request.username !== userFromDB.username;
    } else {
      newUser.username = null;
    }
  }
  if (request.roles) {
    const newRoles = request.roles
      .filter(r => [RoleName.USER, RoleName.CONTRIB, RoleName.TRAD, RoleName.CAREGIVER].includes(r)) // only these roles allowed
      .map(r => roles.find(role => role.nom === r)?._id)
      .filter(r => !!r);
    newUser.roles = uniqIds(newRoles); // keep only roles from request. Needed to fix bug in page "inscription/objectif"
  }
  if (request.email && request.email !== userFromDB.email) {
    const userWithEmail = await getUserFromDB({ email: request.email });
    if (userWithEmail && userWithEmail._id.toString() !== id) {
      throw new UnauthorizedError("Email déjà utilisé", "EMAIL_TAKEN");
    }
    try {
      if (!request.code) {
        await requestEmailLogin(request.email);
        throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED);
      }
      await verifyCode(request.email, request.code);
    } catch (e) {
      loginExceptionsManager(e);
    }
    newUser.email = request.email;
    if (!refreshToken) refreshToken = request.email !== userFromDB.email;
  }
  return { newUser, refreshToken };
}

export const updateUser = async (id: string, body: UpdateUserRequest, userReq: User): Promise<string | null> => {
  const { action } = body;
  logger.info("[updateUser] call received", { user: body.user, action });
  const userFromDB = await getUserById(id, { username: 1, phone: 1, email: 1, roles: 1 });

  let newUser: Partial<User> = {};
  let refreshToken = false;
  if (action === "modify-with-roles") {
    newUser = await updateAsAdmin(body.user, userFromDB, userReq);
  }

  if (action === "modify-my-details") {
    const data = await updateAsMyself(id, body.user, userFromDB, userReq);
    newUser = data.newUser;
    refreshToken = data.refreshToken;
  }

  const user = await updateUserInDB(id, omitBy(newUser, isUndefined));
  const token = refreshToken ? user.getToken() : null;

  await log(id, {
    email: newUser.email || userFromDB.email,
    phone: newUser.phone || userFromDB.phone,
    username: newUser.username || userFromDB.username
  }, userFromDB, userReq._id);

  return token;
};
