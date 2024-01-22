import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
// import { getRoleByName } from "../../../modules/role/role.repository";
import { getUserByUsernameFromDB } from "../../../modules/users/users.repository";
// import { register } from "../../../modules/users/register";
import { login2FA } from "../../../modules/users/login2FA";
import LoginError from "../../../modules/users/LoginError";
import { updateLastConnected } from "../../../modules/users/users.service";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { loginExceptionsManager } from "./login.exceptions.manager";
import { /* logRegister,  */logLogin } from "./log";
import { LoginRequest, LoginResponse, UserStatus } from "@refugies-info/api-types";

import { OAuth2Client } from "google-auth-library";
import { User } from "../../../typegoose/User";
import { DocumentType } from "@typegoose/typegoose";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.FRONT_SITE_URL
);

const authWithPassword = async (user: DocumentType<User>, password: string): Promise<boolean> => {
  logger.info("[authWithPassword] start", { email: user.email });

  // login
  if (!user.authenticate(password)) {
    logger.error("[authWithPassword] incorrect password", { email: user.email });
    throw new LoginError("INVALID_PASSWORD");
  }

  logger.info("[authWithPassword] password correct for user", { email: user.email });
  return true;
}

const authWithGoogle = async (loginRequest: LoginRequest): Promise<string | null> => {
  logger.info("[authWithGoogle] start");
  const { tokens } = await oauth2Client.getToken(loginRequest.authGoogle.authCode)
  const res = await oauth2Client.verifyIdToken({ idToken: tokens.id_token });
  return res.getPayload().email || null;
}



export const login = async (body: LoginRequest): ResponseWithData<LoginResponse> => {
  logger.info("[Login] login attempt");

  try {
    let email: string | null = body.authPassword?.email || null;
    if (body.authGoogle) email = await authWithGoogle(body);
    /* TODO: authMicrosoft */

    const user = await getUserByUsernameFromDB(email).populate("roles");
    if (!user) throw new LoginError("NO_ACCOUNT");
    if (user.status === UserStatus.DELETED) throw new LoginError("USER_DELETED");

    if (body.authPassword) {
      await authWithPassword(user, body.authPassword.password);
    }

    // 2FA
    const userIsAdmin = user.isAdmin();
    const userStructureId = await userRespoStructureId(user.structures.map((s) => s._id) || [], user._id);
    if (userIsAdmin || userStructureId) {
      //@ts-ignore TODO: fix here
      await login2FA(body, user, userIsAdmin ? "admin" : userStructureId);
    }

    await updateLastConnected(user);
    await logLogin(user._id);

    return {
      text: "success",
      data: { token: user.getToken() },
    };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
