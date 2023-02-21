import { FilterQuery } from "mongoose";
import logger from "../../../logger";
import { getSimpleDispositifs } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif, Languages, User } from "../../../typegoose";
import { UserFavoritesRequest } from "../../../controllers/userController";
import { ResponseWithData, SimpleDispositif } from "../../../types/interface";
import { Favorite } from "../../../typegoose/User";

export type GetUserFavoritesResponse = SimpleDispositif;

export const getUserFavoritesInLocale = async (user: User, query: UserFavoritesRequest): ResponseWithData<GetUserFavoritesResponse[]> => {
  logger.info("[getUserFavoritesInLocale] received");

  const favorites: Favorite[] = user.favorites;
  if (favorites.length === 0) {
    return { text: "success", data: [] };
  }

  const selectedLocale = (query.locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = { status: "Actif", _id: { $in: favorites.map(f => f.dispositifId) } };
  const result = await getSimpleDispositifs(dbQuery, selectedLocale);

  return { text: "success", data: result };
};
