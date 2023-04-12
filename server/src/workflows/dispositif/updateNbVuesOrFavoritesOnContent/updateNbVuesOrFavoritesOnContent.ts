import { AddViewsRequest } from "@refugies-info/api-types";
import logger from "../../../logger";
import { incrementDispositifViews } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";

export const updateNbVuesOrFavoritesOnContent = async (id: string, body: AddViewsRequest): Response => {
  logger.info(`[updateNbVuesOrFavoritesOnContent] received for dispositif with id ${id}`, body);

  const properties = body.types.map((type) => {
    switch (type) {
      case "web":
        return "nbVues";
      case "mobile":
        return "nbVuesMobile";
      case "favorite":
        return "nbFavoritesMobile";
    }
  });
  await incrementDispositifViews(id, properties);

  return { text: "success" };
};
