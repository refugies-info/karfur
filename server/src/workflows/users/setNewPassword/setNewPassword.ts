import passwordHash from "password-hash";
import logger from "../../../logger";
import { isPasswordOk } from "../../../libs/validatePassword";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { requestEmailLogin, verifyCode } from "../../../modules/users/login2FA";
import { ResponseWithData } from "../../../types/interface";
import { getUserFromDB } from "../../../modules/users/users.repository";
import { NewPasswordRequest, NewPasswordResponse } from "@refugies-info/api-types";
import { loginExceptionsManager, logUser } from "../../../modules/users/auth";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";

export const setNewPassword = async (body: NewPasswordRequest): ResponseWithData<NewPasswordResponse> => {
  try {
    logger.info("[setNewPassword] received");
    const user = await getUserFromDB({
      reset_password_token: body.reset_password_token,
      reset_password_expires: { $gt: Date.now() },
    }).populate("roles");

    if (!user) throw new LoginError(LoginErrorType.USER_NOT_EXISTS);
    if (!user.email) throw new LoginError(LoginErrorType.NO_EMAIL);
    if (passwordHash.verify(body.newPassword, user.password)) throw new LoginError(LoginErrorType.USED_PASSWORD);
    if (user.isAdmin()) throw new LoginError(LoginErrorType.ADMIN_FORBIDDEN);
    if (!isPasswordOk(body.newPassword)) throw new LoginError(LoginErrorType.PASSWORD_TOO_WEAK);

    const userStructureId = await userRespoStructureId(
      user.structures.map((structure) => structure._id) || [],
      user._id,
    );
    if (userStructureId) {
      if (body.code) {
        await verifyCode(user.email, body.code);
      } else {
        await requestEmailLogin(user.email);
        throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED);
      }
    }
    const token = await logUser(user);
    user.password = passwordHash.generate(body.newPassword);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();

    return {
      data: { token },
      text: "success",
    };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
