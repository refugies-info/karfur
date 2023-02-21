import logger from "../../../logger";
import { Id, User } from "../../../typegoose";
import { AddUserFavorite } from "../../../controllers/userController";
import { Response } from "../../../types/interface";
import { Favorite } from "../../../typegoose/User";
import { addFavoriteInDB } from "../../../modules/users/users.repository";
import { InvalidRequestError } from "../../../errors";

export const addUserFavorite = async (user: User, body: AddUserFavorite): Response => {
  logger.info("[addUserFavorite] received");

  if (user.favorites.find(f => f.dispositifId.toString() === body.dispositifId)) {
    throw new InvalidRequestError("Already in favorites");
  }

  const newFavorite: Favorite = {
    dispositifId: new Id(body.dispositifId),
    created_at: new Date()
  }
  await addFavoriteInDB(user._id, newFavorite);
  return { text: "success" };
};
