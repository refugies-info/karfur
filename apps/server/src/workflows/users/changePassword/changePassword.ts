import passwordHash from "password-hash";
import logger from "../../../logger";
import { getUserById } from "../../../modules/users/users.repository";
import { isPasswordOk } from "../../../libs/validatePassword";
import { UserStatus } from "@refugies-info/api-types";
import { loginExceptionsManager } from "../../../modules/users/auth";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";

/**
 * Returns new hashedPassword if ok
 * @param userId
 * @param oldPassword
 * @param newPassword
 * @returns
 */
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  try {
    logger.info("[changePassword] received");

    const user = await getUserById(userId, {});

    if (!user || user.status === UserStatus.DELETED) {
      throw new LoginError(LoginErrorType.USER_DELETED);
    }

    if (!user.password) { // user logged in with sso cannot change his password
      throw new LoginError(LoginErrorType.INVALID_REQUEST);
    }

    if (!user.authenticate(oldPassword)) {
      throw new LoginError(LoginErrorType.INVALID_PASSWORD);
    }

    if (newPassword === oldPassword) {
      throw new LoginError(LoginErrorType.USED_PASSWORD);
    }

    if (!isPasswordOk(newPassword)) {
      throw new LoginError(LoginErrorType.PASSWORD_TOO_WEAK);
    }

    const newPasswordHashed = passwordHash.generate(newPassword);
    return newPasswordHashed;
  } catch (error) {
    loginExceptionsManager(error);
  }
};
