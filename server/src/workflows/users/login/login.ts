import { DocumentType } from "@typegoose/typegoose";
import { OAuth2Client } from "google-auth-library";
import { LoginRequest, LoginResponse, UserStatus } from "@refugies-info/api-types";
import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getUserByEmailFromDB } from "../../../modules/users/users.repository";
import { requestEmailLogin } from "../../../modules/users/login2FA";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";
import { User } from "../../../typegoose/User";
import { loginExceptionsManager, logUser, needs2FA } from "../../../modules/users/auth";

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
    throw new LoginError(LoginErrorType.INVALID_PASSWORD);
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

    const user = await getUserByEmailFromDB(email).populate("roles");
    if (!user) throw new LoginError(LoginErrorType.NO_ACCOUNT, { email });
    if (user.status === UserStatus.DELETED) throw new LoginError(LoginErrorType.USER_DELETED);

    if (body.authPassword) {
      await authWithPassword(user, body.authPassword.password);
    }

    const userNeeds2FA = await needs2FA(user);
    if (userNeeds2FA) {
      await requestEmailLogin(email);
      throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED);
    } else {
      const token = await logUser(user);
      return {
        text: "success",
        data: { token },
      };
    }
  } catch (error) {
    loginExceptionsManager(error);
  }
};
