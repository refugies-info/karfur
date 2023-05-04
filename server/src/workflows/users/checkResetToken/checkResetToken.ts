import logger from "../../../logger";
import { getUserFromDB } from "../../../modules/users/users.repository";
import { NotFoundError } from "../../../errors";
import { Response } from "../../../types/interface";

export const checkResetToken = async (token: string): Response => {
  logger.info("[checkResetToken] received");

  const user = await getUserFromDB({
    reset_password_token: token,
    reset_password_expires: { $gt: Date.now() }
  });
  if (!user) throw new NotFoundError("Token invalide");

  return { text: "success" };
};
