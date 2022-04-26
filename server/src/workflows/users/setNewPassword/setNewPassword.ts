import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import logger from "../../../logger";
import { computePasswordStrengthScore } from "../../../libs/computePasswordStrengthScore";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { proceedWithLogin } from "../../../modules/users/users.service";
import { login2FA } from "../../../modules/users/login2FA";
import { loginExceptionsManager } from "../login/login.exceptions.manager";
import passwordHash from "password-hash";
import { User } from "src/schema/schemaUser";

interface Query {
  newPassword: string;
  reset_password_token: string;
  code?: string;
  email?: string;
  phone?: string;
}
export const setNewPassword = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[setNewPassword] received");
    checkRequestIsFromSite(req.fromSite);
    const { newPassword, reset_password_token } = req.body;

    if (
      !newPassword ||
      !reset_password_token
    ) {
      throw new Error("INVALID_REQUEST");
    }

    const user = await User.findOne({
      reset_password_token,
      reset_password_expires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("USER_NOT_EXISTS");
    } else if (!user.email) {
      throw new Error("NO_EMAIL");
    }

    const adminRoleId = req.roles.find((x) => x.nom === "Admin")._id.toString();
    if ((user.roles || []).some((x) => x && x.toString() === adminRoleId)) {
      throw new Error("ADMIN_FORBIDDEN");
    }

    if ((computePasswordStrengthScore(newPassword) || {}).score < 1) {
      throw new Error("PASSWORD_TOO_WEAK");
    }

    const userStructureId = await userRespoStructureId(user.structures || [], user._id);
    if (userStructureId) {
      await login2FA({
        username: user.username,
        password: newPassword,
        code: req.body.code,
        email: req.body.email,
        phone: req.body.phone,
      }, user, userStructureId);
    }
    await proceedWithLogin(user);
    user.password = passwordHash.generate(newPassword);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();

    return res.status(200).json({
      // @ts-ignore
      token: user.getToken(),
      text: "Authentification réussie",
    });
  } catch (error) {
    return loginExceptionsManager(error, res);
  }
};
