import logger from "../../../logger";
import { SendCodeRequest } from "@refugies-info/api-types";
import { requestEmailLogin } from "../../../modules/users/login2FA";
import { loginExceptionsManager } from "../../../modules/users/auth";

export const sendCode = async (body: SendCodeRequest): Promise<boolean> => {
  logger.info("[sendCode] send 2fa code");
  try {
    await requestEmailLogin(body.email);
    return true;
  } catch (error) {
    loginExceptionsManager(error);
  }
};
