import passwordHash from "password-hash";
import logger from "../../../logger";
import { LoginResponse, RegisterRequest } from "@refugies-info/api-types";
import { loginExceptionsManager } from "../../../modules/users/auth";
import { isPasswordOk } from "../../../libs/validatePassword";
import { LoginErrorType } from "../../../modules/users/LoginError";
import { addToNewsletter } from "../../../connectors/sendinblue/addToNewsletter";
import { registerUser } from "../../../modules/users/users.service";

export const register = async (body: RegisterRequest): Promise<LoginResponse> => {
  logger.info("[Register] register user", { email: body.email });

  try {
    if (!isPasswordOk(body.password)) {
      logger.error("[Register] register failed, password too weak", { email: body.email });
      throw new Error(LoginErrorType.PASSWORD_TOO_WEAK);
    }
    const hashedPassword = passwordHash.generate(body.password);
    const user = await registerUser({
      email: body.email,
      firstName: body.firstName,
      role: body.role,
      hashedPassword
    });

    if (body.subscribeNewsletter) {
      try {
        await addToNewsletter(body.email);
      } catch (e) {
        logger.error("[register] error, not added to newsletter", { email: body.email });
      }
    }

    return { token: user.getToken() };
  } catch (error) {
    loginExceptionsManager(error);
  }
};
