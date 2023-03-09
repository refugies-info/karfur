import crypto from "crypto";
import logger from "../../../logger";
import { getUserByUsernameFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { InvalidRequestError, NotFoundError, UnauthorizedError, AuthenticationError } from "../../../errors";
import { ResponseWithData } from "../../../types/interface";
import { sendResetPasswordMail } from "../../../modules/mail/mail.service";
import { ResetPasswordRequest, ResetPasswordResponse } from "api-types";

const url = process.env.FRONT_SITE_URL;

export const resetPassword = async (body: ResetPasswordRequest): ResponseWithData<ResetPasswordResponse> => {
  logger.info("[resetPassword] received");

  const user = await getUserByUsernameFromDB(body.username);
  if (!user) throw new NotFoundError("L'utilisateur n'existe pas", null, { noAlert: true });
  if (!user.email) throw new AuthenticationError("Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.");
  if (user.isAdmin()) throw new UnauthorizedError("Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site");

  await new Promise((resolve, reject) => {
    crypto.randomBytes(20, async function (errb, buffer) {
      if (errb) reject(new InvalidRequestError(errb.message))
      const token = buffer.toString("hex");
      await updateUserInDB(user._id, {
        reset_password_token: token,
        reset_password_expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      })
      const newUrl = url + "/reset?token=" + token;
      await sendResetPasswordMail(body.username, newUrl, user.email);
      resolve(true);
    });
  })


  return {
    text: "success",
    data: { email: user.email }
  };
};
