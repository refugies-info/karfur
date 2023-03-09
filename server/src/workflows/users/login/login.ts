import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getRoleByName } from "../../../modules/role/role.repository";
import { getUserByUsernameFromDB } from "../../../modules/users/users.repository";
import { register } from "../../../modules/users/register";
import { login2FA } from "../../../modules/users/login2FA";
import LoginError from "../../../modules/users/LoginError";
import { proceedWithLogin } from "../../../modules/users/users.service";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { loginExceptionsManager } from "./login.exceptions.manager";
import { logRegister, logLogin } from "./log";
import { LoginRequest, LoginResponse, UserStatus } from "api-types";

export const login = async (body: LoginRequest): ResponseWithData<LoginResponse> => {
  try {
    logger.info("[Login] login attempt", { username: body.username });
    const user = await getUserByUsernameFromDB(body.username).populate("roles");

    if (user && user.status === UserStatus.DELETED) {
      throw new LoginError("USER_DELETED");
    }

    // register
    if (!user) {
      const userRole = await getRoleByName("User");
      const { user, token } = await register(body, userRole);
      await logRegister(user._id);
      return {
        text: "success",
        data: { token },
      }
    }

    // login
    if (!user.authenticate(body.password)) {
      logger.error("[Login] incorrect password", { username: body.username });
      throw new LoginError("INVALID_PASSWORD");
    }

    logger.info("[Login] password correct for user", { username: body.username });

    // check if user is admin
    const userIsAdmin = user.isAdmin();
    const userStructureId = await userRespoStructureId(user.structures.map((s) => s._id) || [], user._id);
    if (userIsAdmin || userStructureId) {
      await login2FA(body, user, userIsAdmin ? "admin" : userStructureId);
    }
    await proceedWithLogin(user);
    await logLogin(user._id);

    return {
      text: "success",
      data: { token: user.getToken() },
    }
  } catch (error) {
    loginExceptionsManager(error);
  }
};
