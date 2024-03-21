import logger from "../../../logger";
import { CheckCodeRequest, LoginResponse } from "@refugies-info/api-types";
import { verifyCode } from "../../../modules/users/login2FA";
import { isMfaCodeOk, loginExceptionsManager, logUser, needs2FA } from "../../../modules/users/auth";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";

export const checkCode = async (body: CheckCodeRequest): Promise<LoginResponse> => {
  logger.info("[checkCode] check 2fa code", { email: body.email });
  try {
    const userNeeds2FA = await needs2FA(body.email);
    if (userNeeds2FA) {
      const codeOk = await isMfaCodeOk(body.mfaCode, body.email)
      if (!codeOk) {
        logger.info("[checkCode] mfaCode wrong");
        throw new LoginError(LoginErrorType.WRONG_CODE);
      }
    }
    await verifyCode(body.email, body.code);
    const token = await logUser(body.email);
    return { token }
  } catch (error) {
    loginExceptionsManager(error);
  }
};
