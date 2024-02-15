import logger from "../../../logger";
import { CheckCodeRequest, LoginResponse } from "@refugies-info/api-types";
import { verifyCode } from "../../../modules/users/login2FA";
import { loginExceptionsManager, logUser } from "../../../modules/users/auth";

export const checkCode = async (body: CheckCodeRequest): Promise<LoginResponse> => {
  logger.info("[checkCode] check 2fa code");
  try {
    await verifyCode(body.email, body.code);
    const token = await logUser(body.email);
    return { token }
  } catch (error) {
    loginExceptionsManager(error);
  }
};
