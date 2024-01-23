import { CheckUserExistsResponse } from "@refugies-info/api-types";
import logger from "../../../logger";
import { NotFoundError } from "../../../errors";
import { getUserByEmailFromDB } from "../../../modules/users/users.repository";
import { needs2FA } from "../../../modules/users/auth";

export const checkUserExists = async (email: string): Promise<CheckUserExistsResponse> => {
  logger.info("[checkUserExists] received");

  const user = await getUserByEmailFromDB(email);
  if (!user) throw new NotFoundError("User not found");

  const userNeeds2FA = await needs2FA(user);

  return { verificationCode: userNeeds2FA };
};
