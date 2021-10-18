import { RequestFromClient, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";

interface Query {
  id: ObjectId;
  nbVues?: number;
  nbVuesMobile?: number;
  nbFavoritesMobile?: number;
}

const computeQuery = (
  nbFavoritesMobile: undefined | number,
  nbVues: undefined | number,
  nbVuesMobile: undefined | number
) => {
  if (nbVuesMobile) {
    return { nbVuesMobile };
  }
  if (nbVues) {
    return { nbVues };
  }
  return { nbFavoritesMobile };
};
export const updateNbVuesOrFavoritesOnContent = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    const { id, nbVues, nbVuesMobile, nbFavoritesMobile } = req.body.query;
    logger.info(
      `[updateNbVuesOrFavoritesOnContent] received for dispositif with id ${id}`,
      { nbVues, nbVuesMobile, nbFavoritesMobile }
    );

    const query = computeQuery(nbFavoritesMobile, nbVues, nbVuesMobile);
    await updateDispositifInDB(id, query);

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateNbVuesOrFavoritesOnContent] error", {
      error: error.message,
    });
    res.status(500).json({ text: "KO" });
  }
};
