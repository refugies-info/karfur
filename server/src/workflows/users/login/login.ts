import logger from "logger";
import { RequestFromClientWithBody, Res } from "types/interface";
import { getRoleByName } from "controllers/role/role.repository";
import { getUserByUsernameFromDB } from "modules/users/users.repository";
import { register } from "modules/users/register";
import { login2FA } from "modules/users/login2FA";
import LoginError from "modules/users/LoginError";
import { proceedWithLogin } from "modules/users/users.service";
import { userRespoStructureId } from "modules/structure/structure.service";
import { loginExceptionsManager } from "./login.exceptions.manager";
import { checkRequestIsFromSite } from "libs/checkAuthorizations";
import { logRegister, logLogin } from "./log";

interface User {
  username: string;
  password: string;
  code?: string;
  email?: string;
  phone?: string;
}

// route called when login or register
export const login = async (req: RequestFromClientWithBody<User>, res: Res) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new LoginError("INVALID_REQUEST");
    }

    checkRequestIsFromSite(req.fromSite);

    logger.info("[Login] login attempt", {
      username: req.body && req.body.username,
    });

    const user = await getUserByUsernameFromDB(req.body.username);

    if (user && user.status === "Exclu") {
      throw new LoginError("USER_DELETED");
    }

    if (!user) {
      const userRole = await getRoleByName("User");
      const { user, token } = await register(req.body, userRole);
      await logRegister(user._id);
      return res.status(200).json({
        text: "Succès",
        token,
        data: user,
      });
    }

    // @ts-ignore : no authenticate on user Model from mongodb
    if (!user.authenticate(req.body.password)) {
      logger.error("[Login] incorrect password", {
        username: req.body && req.body.username,
      });

      throw new LoginError("INVALID_PASSWORD");
    }

    logger.info("[Login] password correct for user", {
      username: req.body && req.body.username,
    });

    // check if user is admin
    const adminRoleId = req.roles.find((x) => x.nom === "Admin")._id.toString();
    const userIsAdmin = (user.roles || []).some((x) => x && x.toString() === adminRoleId);
    const userStructureId = await userRespoStructureId(user.structures || [], user._id);

    if (userIsAdmin || userStructureId) {
      await login2FA(req.body, user, userIsAdmin ? "admin" : userStructureId);
    }
    await proceedWithLogin(user);
    await logLogin(user._id);
    return res.status(200).json({
      // @ts-ignore
      token: user.getToken(),
      text: "Authentification réussi",
    });
  } catch (error) {
    return loginExceptionsManager(error, res);
  }
};
