import type { SendCodeRequest } from "@refugies-info/api-types";
import { TooManyRequestsError } from "~/errors";
import logger from "~/logger";
import { loginExceptionsManager } from "~/modules/users/auth";
import { clearSent, getRetryAfter, markSent } from "~/modules/users/emailThrottle";
import { requestEmailLogin } from "~/modules/users/login2FA";

export const sendCode = async (body: SendCodeRequest): Promise<boolean> => {
  logger.info("[sendCode] send 2fa code");

  const retryAfter = getRetryAfter("send-code", body.email);
  if (retryAfter > 0) {
    logger.info("[sendCode] rate limited", { retryAfter });
    throw new TooManyRequestsError(
      "Un code vient déjà d'être envoyé, merci de patienter avant d'en demander un nouveau.",
      "SEND_CODE_TOO_SOON",
      { retryAfter },
    );
  }

  // Locked before the Twilio call so two concurrent requests cannot both go through.
  markSent("send-code", body.email);
  try {
    await requestEmailLogin(body.email);
    return true;
  } catch (error) {
    clearSent("send-code", body.email);
    loginExceptionsManager(error);
  }
};
