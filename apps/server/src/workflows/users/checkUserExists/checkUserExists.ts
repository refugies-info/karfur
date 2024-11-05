import { CheckUserExistsResponse } from "@refugies-info/api-types";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { needs2FA } from "~/modules/users/auth";
import { getUserByEmailFromDB } from "~/modules/users/users.repository";

export const checkUserExists = async (email: string): Promise<CheckUserExistsResponse> => {
  logger.info("[checkUserExists] received");

  const user = await getUserByEmailFromDB(email).populate("roles");
  if (!user) throw new NotFoundError("User not found");

  const userNeeds2FA = await needs2FA(user);

  return { verificationCode: userNeeds2FA };
};
