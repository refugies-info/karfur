import type {
  GetUserFavoritesRequest,
  GetUserFavoritesResponse,
  Languages,
} from "@refugies-info/api-types";
import { type Dispositif, type Favorite, ObjectId, type User } from "@refugies-info/mongo";
import type { FilterQuery } from "mongoose";
import logger from "~/logger";
import { getSimpleDispositifs } from "~/modules/dispositif/dispositif.repository";
import type { ResponseWithData } from "~/types/interface";

export const getUserFavoritesInLocale = async (
  user: User,
  query: GetUserFavoritesRequest,
): ResponseWithData<GetUserFavoritesResponse[]> => {
  logger.info("[getUserFavoritesInLocale] received");

  const favorites: Favorite[] = (user.favorites || []).map((f) => ({
    ...f,
    dispositifId: new ObjectId(f.dispositifId.toString()),
    created_at: f.created_at || new Date(),
  }));
  if (favorites.length === 0) {
    return { text: "success", data: [] };
  }

  const selectedLocale = (query.locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = {
    status: "Actif",
    _id: { $in: favorites.map((f) => f.dispositifId) },
  };
  const result = await getSimpleDispositifs(dbQuery, selectedLocale);

  return { text: "success", data: result as unknown as GetUserFavoritesResponse[] };
};
