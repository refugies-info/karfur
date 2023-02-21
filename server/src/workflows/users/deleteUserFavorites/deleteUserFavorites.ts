import { Response } from "../../../types/interface";
import logger from "../../../logger";
import { removeFavoriteFromDB, updateUserInDB } from "../../../modules/users/users.repository";
import { User } from "../../../typegoose";
import { DeleteUserFavorite } from "../../../controllers/userController";
import { InvalidRequestError } from "../../../errors";


export const deleteUserFavorites = async (user: User, query: DeleteUserFavorite): Response => {
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
