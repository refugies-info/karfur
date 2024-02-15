import crypto from "crypto";
import { ResetPasswordRequest, ResetPasswordResponse } from "@refugies-info/api-types";
import logger from "../../../logger";
import { getUserByEmailFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { ResponseWithData } from "../../../types/interface";
import { sendResetPasswordMail } from "../../../modules/mail/mail.service";
import LoginError, { LoginErrorType } from "../../../modules/users/LoginError";

const url = process.env.FRONT_SITE_URL;

export const resetPassword = async (body: ResetPasswordRequest): ResponseWithData<ResetPasswordResponse> => {
  logger.info("[resetPassword] received", { email: body.email });

  const user = await getUserByEmailFromDB(body.email);
  if (!user) throw new LoginError(LoginErrorType.USER_NOT_EXISTS);
  if (user.isAdmin()) throw new LoginError(LoginErrorType.ADMIN_FORBIDDEN);

  await new Promise((resolve, reject) => {
    crypto.randomBytes(20, async function (errb, buffer) {
      if (errb) reject(new LoginError(LoginErrorType.INVALID_REQUEST, { message: errb.message }));
      const token = buffer.toString("hex");
      await updateUserInDB(user._id, {
        reset_password_token: token,
        reset_password_expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      });
      const newUrl = url + "/auth/reinitialiser-mot-de-passe/nouveau?token=" + token;
      await sendResetPasswordMail(user.username, newUrl, user.email);
      resolve(true);
    });
  });

  return {
    text: "success",
    data: { email: user.email },
  };
};
