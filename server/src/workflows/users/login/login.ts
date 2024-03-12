import { DocumentType } from "@typegoose/typegoose";
import { OAuth2Client } from "google-auth-library";
import msal from "@azure/msal-node";
import { LoginRequest, LoginResponse, UserStatus } from "@refugies-info/api-types";
import logger from "../../../logger";
import { getUserByEmailFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { requestEmailLogin } from "../../../modules/users/login2FA";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";
import { User } from "../../../typegoose/User";
import { loginExceptionsManager, logUser, needs2FA } from "../../../modules/users/auth";
import { registerUser } from "../../../modules/users/users.service";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.FRONT_SITE_URL
);

const cca = new msal.ConfidentialClientApplication({
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET
  }
});
const MICROSOFT_REDIRECT_URL = process.env.FRONT_SITE_URL + "/fr/auth/microsoft-login";
const MICROSOFT_SCOPES = ["User.Read"];

export const authWithPassword = async (user: DocumentType<User>, password: string): Promise<boolean> => {
  logger.info("[authWithPassword] start", { email: user.email });

  if (!user.authenticate(password)) {
    logger.error("[authWithPassword] incorrect password", { email: user.email });
    throw new LoginError(LoginErrorType.INVALID_PASSWORD);
  }

  logger.info("[authWithPassword] password correct for user", { email: user.email });
  return true;
}

export const authWithGoogle = async (loginRequest: LoginRequest): Promise<{ email: string, name: string } | null> => {
  logger.info("[authWithGoogle] start");
  const { tokens } = await oauth2Client.getToken(loginRequest.authGoogle.authCode)
  const res = await oauth2Client.verifyIdToken({ idToken: tokens.id_token });

  const email = res.getPayload().email;
  const name = res.getPayload().given_name || "";
  return email ? { email, name } : null;
}

export const authWithMicrosoft = async (loginRequest: LoginRequest): Promise<string | null> => {
  logger.info("[authWithMicrosoft] start");
  if (loginRequest.authMicrosoft.authCode === null) {
    const url = await cca.getAuthCodeUrl({
      scopes: MICROSOFT_SCOPES,
      redirectUri: MICROSOFT_REDIRECT_URL,
      prompt: "consent"
    })
    throw new LoginError(LoginErrorType.SSO_URL, { url });
  } else {
    const res = await cca.acquireTokenByCode({
      code: loginRequest.authMicrosoft.authCode,
      redirectUri: MICROSOFT_REDIRECT_URL,
      scopes: MICROSOFT_SCOPES,
    });
    return res.account?.username || null;
  }
}

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  logger.info("[Login] login attempt");

  try {
    let email: string | null = body.authPassword?.email || null;
    let name: string | null = null;
    if (body.authGoogle) {
      const data = await authWithGoogle(body);
      email = data.email;
      name = data.name;
    }
    if (body.authMicrosoft) email = await authWithMicrosoft(body);

    const user = await getUserByEmailFromDB(email).populate("roles");
    if (!user) {
      // if sso and no user, create account
      if (body.authGoogle || body.authMicrosoft) {
        const user = await registerUser({ email, role: body.role, firstName: name });
        return { token: user.getToken(), userCreated: true };
      }
      throw new LoginError(LoginErrorType.NO_ACCOUNT, { email });
    }
    if (user.status === UserStatus.DELETED) throw new LoginError(LoginErrorType.USER_DELETED);

    if (body.authPassword) {
      if (!user.password) throw new LoginError(LoginErrorType.SSO_NO_PASSWORD);
      await authWithPassword(user, body.authPassword.password);
    }

    const userNeeds2FA = await needs2FA(user);
    if (userNeeds2FA) {
      await requestEmailLogin(email);
      const randomCode = Math.round(Math.random() * 100000000).toString();
      await updateUserInDB(user._id, { mfaCode: randomCode });
      throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED, { email, code: randomCode });
    } else {
      const token = await logUser(user);
      return { token };
    }
  } catch (error) {
    loginExceptionsManager(error);
  }
};
