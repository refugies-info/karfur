import { NewPasswordRequest, NewPasswordResponse } from "@refugies-info/api-types";
import passwordHash from "password-hash";
import { isPasswordOk } from "~/libs/validatePassword";
import logger from "~/logger";
import { userRespoStructureId } from "~/modules/structure/structure.service";
import { loginExceptionsManager, logUser } from "~/modules/users/auth";
import { requestEmailLogin, verifyCode } from "~/modules/users/login2FA";
import LoginError, { LoginErrorType } from "~/modules/users/LoginError";
import { getUserFromDB } from "~/modules/users/users.repository";
import { ResponseWithData } from "~/types/interface";

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
