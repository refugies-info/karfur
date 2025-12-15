import type { AddUserFavoriteRequest } from "@refugies-info/api-types";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";
import { addFavoriteInDB } from "~/modules/users/users.repository";
import { ObjectId, type User } from "~/typegoose";
import type { Favorite } from "~/typegoose/User";
import type { Response } from "~/types/interface";

export const addUserFavorite = async (user: User, body: AddUserFavoriteRequest): Response => {
  logger.info("[addUserFavorite] received");

  if (user.favorites.find((f) => f.dispositifId.toString() === body.dispositifId)) {
    throw new InvalidRequestError("Already in favorites");
  }

  const newFavorite: Favorite = {
    dispositifId: new ObjectId(body.dispositifId),
    created_at: new Date(),
  };
  await addFavoriteInDB(user._id, newFavorite);
  return { text: "success" };
};
