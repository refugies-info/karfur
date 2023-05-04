import passwordHash from "password-hash";
import logger from "../../../logger";
import { isPasswordOk } from "../../../libs/validatePassword";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { proceedWithLogin } from "../../../modules/users/users.service";
import { login2FA } from "../../../modules/users/login2FA";
import { ResponseWithData } from "../../../types/interface";
import { getUserFromDB } from "../../../modules/users/users.repository";
import { loginExceptionsManager } from "../login/login.exceptions.manager";
import { NewPasswordRequest, NewPasswordResponse } from "@refugies-info/api-types";

export const setNewPassword = async (body: NewPasswordRequest): ResponseWithData<NewPasswordResponse> => {
  try {
    logger.info("[setNewPassword] received");
    const user = await getUserFromDB({
      reset_password_token: body.reset_password_token,
      reset_password_expires: { $gt: Date.now() },
    }).populate("roles");

    if (!user) {
      throw new Error("USER_NOT_EXISTS");
    } else if (!user.email) {
      throw new Error("NO_EMAIL");
    } else if (passwordHash.verify(body.newPassword, user.password)) {
      throw new Error("USED_PASSWORD");
    }

    if (user.isAdmin()) {
      throw new Error("ADMIN_FORBIDDEN");
    }

    if (!isPasswordOk(body.newPassword)) {
      throw new Error("PASSWORD_TOO_WEAK");
    }

    const userStructureId = await userRespoStructureId(
      user.structures.map((structure) => structure._id) || [],
      user._id,
    );
    if (userStructureId) {
      await login2FA(
        {
          username: user.username,
          password: body.newPassword,
          code: body.code,
          email: body.email,
          phone: body.phone,
        },
        user,
        userStructureId,
      );
    }
    await proceedWithLogin(user);
    user.password = passwordHash.generate(body.newPassword);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();

    return {
      data: { token: user.getToken() },
      text: "success",
    };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
