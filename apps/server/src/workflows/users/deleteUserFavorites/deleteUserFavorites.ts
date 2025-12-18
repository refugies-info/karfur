import type { DeleteUserFavoriteRequest } from "@refugies-info/api-types";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";
import { removeFavoriteFromDB, updateUserInDB } from "~/modules/users/users.repository";
import type { User } from "~/typegoose";
import type { Response } from "~/types/interface";

export const deleteUserFavorites = async (
  user: User,
  query: DeleteUserFavoriteRequest,
): Response => {
  logger.info("[deleteUserFavorites] received");

  if (query.all) {
    await updateUserInDB(user._id, { favorites: [] });
    return { text: "success" };
  }

  if (query.dispositifId) {
    await removeFavoriteFromDB(user._id, query.dispositifId);
    return { text: "success" };
  }

  throw new InvalidRequestError("Wrong parameters");
};
