import logger from "../../../logger";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif, Languages, User } from "../../../typegoose";
import { UserFavoritesRequest } from "../../../controllers/userController";
import { Id, Metadatas, Picture, ResponseWithData } from "../../../types/interface";
import { FilterQuery } from "mongoose";
import map from "lodash/fp/map";
import omit from "lodash/omit";
import pick from "lodash/pick";

export interface GetUserFavoritesResponse {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: string;
  status: string;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  mainSponsor?: {
    nom: string;
    picture: Picture
  }
}

export const getUserFavoritesInLocale = async (user: User, query: UserFavoritesRequest): ResponseWithData<GetUserFavoritesResponse[]> => {
  logger.info("[getUserFavoritesInLocale] received");

  const favorites: { _id: string }[] =
    // @ts-ignore FIXME
    user.cookies && user.cookies.dispositifsPinned && user.cookies.dispositifsPinned.length > 0
      ? // @ts-ignore FIXME
      user.cookies.dispositifsPinned
      : [];

  if (favorites.length === 0) {
    return { text: "success", data: [] };
  }

  const selectedLocale = (query.locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = { status: "Actif", _id: { $in: favorites.map(f => f._id) } };
  const result = await getDispositifArray(dbQuery, {
    lastModificationDate: 1,
    mainSponsor: 1,
    needs: 1
  }, "mainSponsor")
    .then(map((dispositif) => {
      const resDisp: GetUserFavoritesResponse = {
        _id: dispositif._id,
        ...pick(dispositif.translations[selectedLocale].content, ["titreInformatif", "titreMarque", "abstract"]),
        metadatas: { ...dispositif.metadatas, ...dispositif.translations[selectedLocale].metadatas },
        ...omit(dispositif, ["translations"]),
      }
      return resDisp
    }))

  return { text: "success", data: result };
};
