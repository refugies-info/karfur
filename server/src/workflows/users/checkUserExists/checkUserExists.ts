import logger from "../../../logger";
import { getUserByUsernameFromDB } from "../../../modules/users/users.repository";
import { NotFoundError } from "../../../errors";
import { Response } from "../../../types/interface";

export const checkUserExists = async (username: string): Response => {
  logger.info("[checkUserExists] received");

  const user = await getUserByUsernameFromDB(username);
  if (!user) throw new NotFoundError("User not found");

  return { text: "success" };
};
