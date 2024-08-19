import logger from "../../../logger";
import { ObjectId, User } from "../../../typegoose";
import { Response } from "../../../types/interface";
import { Favorite } from "../../../typegoose/User";
import { addFavoriteInDB } from "../../../modules/users/users.repository";
import { InvalidRequestError } from "../../../errors";
import { AddUserFavoriteRequest } from "@refugies-info/api-types";

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
