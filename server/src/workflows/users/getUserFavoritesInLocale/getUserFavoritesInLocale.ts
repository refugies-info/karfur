import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
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
    if (!req.query.locale) {
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
      return res.status(200).json({ data: [] });
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

    const locale = req.query.locale;

    const result: any = [];

    await asyncForEach(favorites, async (favorite) => {
      const dispositif = await getDispositifById(favorite._id, neededFields);
      if (dispositif.status !== "Actif") return;
      turnToLocalized(dispositif, locale);

      // @ts-ignore
      const formattedDispositif = formatDispositif(dispositif);
      result.push(formattedDispositif);
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    logger.error("[getUserFavoritesInLocale] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
