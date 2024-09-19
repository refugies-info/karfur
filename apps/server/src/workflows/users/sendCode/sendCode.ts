import { SendCodeRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { loginExceptionsManager } from "~/modules/users/auth";
import { requestEmailLogin } from "~/modules/users/login2FA";

export const sendCode = async (body: SendCodeRequest): Promise<boolean> => {
  logger.info("[sendCode] send 2fa code");
  try {
    await requestEmailLogin(body.email);
    return true;
  } catch (error) {
    loginExceptionsManager(error);
  }
};
