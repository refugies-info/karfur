import { RequestFromClient, Res } from "../../../types/interface";
import logger = require("../../../logger");
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { asyncForEach } from "../../../libs/asyncForEach";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalized } from "../../../controllers/dispositif/functions";
import { ObjectId } from "mongoose";

interface Query {
  locale: string;
}

interface Dispositif {
  titreInformatif: string;
  titreMarque: string;
  _id: ObjectId;
  tags: any;
  abstract: string;
  status: string;
  typeContenu: string;
  contenu: any;
  toJSON: () => void;
}
const formatDispositif = (dispositif: Dispositif) => {
  // @ts-ignore
  const newDispo = { ...dispositif.toJSON() };
  delete newDispo.contenu;
  return newDispo;
};

export const getUserFavoritesInLocale = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    if (!req.body.locale) {
      throw new Error("INVALID_REQUEST");
    }

    logger.info("[getUserFavoritesInLocale] received");

    const user = req.user;
    const favorites =
      user.cookies &&
      user.cookies.dispositifsPinned &&
      user.cookies.dispositifsPinned.length > 0
        ? user.cookies.dispositifsPinned
        : [];

    if (favorites.length === 0) {
      res.status(200).json({ data: [] });
    }
    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      _id: 1,
      tags: 1,
      abstract: 1,
      status: 1,
      typeContenu: 1,
      contenu: 1,
    };

    const locale = req.body.locale;

    const result: any = [];

    await asyncForEach(favorites, async (favorite) => {
      const dispositif = await getDispositifById(favorite._id, neededFields);
      turnToLocalized(dispositif, locale);
      // @ts-ignore
      const formattedDispositif = formatDispositif(dispositif);
      result.push(formattedDispositif);
    });

    res.status(200).json({ data: result });
  } catch (error) {
    logger.error("[getUserFavoritesInLocale] error", { error: error.message });
    res.status(500).json({ text: "Erreur interne" });
  }
};
