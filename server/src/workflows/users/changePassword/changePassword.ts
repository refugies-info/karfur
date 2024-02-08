import passwordHash from "password-hash";
import logger from "../../../logger";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { isPasswordOk } from "../../../libs/validatePassword";
import { User } from "../../../typegoose/User";
import { ResponseWithData } from "../../../types/interface";
import { UpdatePasswordRequest, UpdatePasswordResponse, UserStatus } from "@refugies-info/api-types";
import { loginExceptionsManager } from "../../../modules/users/auth";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";

/* TODO: delete? */
export const changePassword = async (
  id: string,
  body: UpdatePasswordRequest,
  userReq: User,
): ResponseWithData<UpdatePasswordResponse> => {
  try {

    logger.info("[changePassword] received");

    const { currentPassword, newPassword } = body;
    if (id !== userReq._id.toString()) {
      throw new LoginError(LoginErrorType.INVALID_REQUEST);
    }

    const user = await getUserById(id, {});

    if (!user || user.status === UserStatus.DELETED) {
      throw new LoginError(LoginErrorType.USER_DELETED);
    }

    if (!user.authenticate(currentPassword)) {
      throw new LoginError(LoginErrorType.INVALID_PASSWORD);
    }

    if (newPassword === currentPassword) {
      throw new LoginError(LoginErrorType.USED_PASSWORD);
    }

    if (!isPasswordOk(newPassword)) {
      throw new LoginError(LoginErrorType.PASSWORD_TOO_WEAK);
    }

    const newPasswordHashed = passwordHash.generate(newPassword);

    const updatedUser = await updateUserInDB(id, {
      password: newPasswordHashed,
    });

    return {
      text: "success",
      data: { token: updatedUser.getToken() },
    };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
