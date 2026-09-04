import type { ResetPasswordRequest, ResetPasswordResponse } from "@refugies-info/api-types";
import crypto from "crypto";
import { NotFoundError, TooManyRequestsError } from "~/errors";
import logger from "~/logger";
import { sendResetPasswordMail } from "~/modules/mail/mail.service";
import { clearSent, getRetryAfter, markSent } from "~/modules/users/emailThrottle";
import LoginError, { LoginErrorType } from "~/modules/users/LoginError";
import { getUserByEmailFromDB, updateUserInDB } from "~/modules/users/users.repository";
import type { ResponseWithData } from "~/types/interface";

const url = process.env.FRONT_SITE_URL;

export const resetPassword = async (
  body: ResetPasswordRequest,
): ResponseWithData<ResetPasswordResponse> => {
  logger.info("[resetPassword] received", { email: body.email });

  const retryAfter = getRetryAfter("reset-password", body.email);
  if (retryAfter > 0) {
    logger.info("[resetPassword] rate limited", { retryAfter });
    throw new TooManyRequestsError(
      "Un lien vient déjà d'être envoyé, merci de patienter avant d'en demander un nouveau.",
      "RESET_PASSWORD_TOO_SOON",
      { retryAfter },
    );
  }

  const user = await getUserByEmailFromDB(body.email);
  if (!user) throw new NotFoundError(LoginErrorType.USER_NOT_EXISTS);

  // Locked before the send so two concurrent requests cannot both go through.
  markSent("reset-password", body.email);
  try {
    await new Promise((resolve, reject) => {
      crypto.randomBytes(20, async (errb, buffer) => {
        if (errb) {
          reject(new LoginError(LoginErrorType.INVALID_REQUEST, { message: errb.message }));
          return;
        }
        try {
          const token = buffer.toString("hex");
          await updateUserInDB(user._id, {
            reset_password_token: token,
            reset_password_expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
          });
          const newUrl = url + "/auth/reinitialiser-mot-de-passe/nouveau?token=" + token;
          await sendResetPasswordMail(user._id.toString(), newUrl, user.email);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    });
  } catch (error) {
    clearSent("reset-password", body.email);
    throw error;
  }

  return {
    text: "success",
    data: { email: user.email },
  };
};
