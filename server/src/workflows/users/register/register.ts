import passwordHash from "password-hash";
import logger from "../../../logger";
import { LoginResponse, RegisterRequest, RoleName, UserStatus } from "@refugies-info/api-types";
import { loginExceptionsManager } from "../../../modules/users/auth";
import { isPasswordOk } from "../../../libs/validatePassword";
import { createUser } from "../../../modules/users/users.repository";
import { sendWelcomeMail } from "../../../modules/mail/mail.service";
import { LoginErrorType } from "../../../modules/users/LoginError";
import { getRoleByName } from "../../../modules/role/role.repository";
import { addLog } from "../../../modules/logs/logs.service";

export const register = async (body: RegisterRequest): Promise<LoginResponse> => {
  logger.info("[Register] register user", { email: body.email });

  try {
    if (!isPasswordOk(body.password)) {
      logger.error("[Register] register failed, password too weak", { email: body.email });
      throw new Error(LoginErrorType.PASSWORD_TOO_WEAK);
    }
    const hashedPassword = passwordHash.generate(body.password);
    const userRole = await getRoleByName(RoleName.USER);

    const userToSave = {
      email: body.email,
      firstName: body.firstName || null,
      password: hashedPassword,
      roles: [userRole._id],
      status: UserStatus.ACTIVE,
      last_connected: new Date(),
    };
    const savedUser = await createUser(userToSave);

    if (savedUser.email) {
      await sendWelcomeMail(savedUser.email, savedUser.firstName, savedUser._id);
    }

    logger.info("[Register] successfully registered a new user", {
      email: body.email,
    });

    await addLog(savedUser._id, "User", "Utilisateur créé : première connexion");

    return { token: savedUser.getToken() };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
