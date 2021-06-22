import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

interface Query {
  locale: string;
}

export const getContentsForApp = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.query || !req.query.locale) {
      throw new Error("INVALID_REQUEST");
    }
    const locale = req.query.locale;

    logger.info("[getContentsForApp] called", { locale });

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
    };
    const contentsArray = await getActiveContents(neededFields);
    contentsArray.map((content) => {
      turnToLocalizedTitles(content);
    });

    res.status(200).json({
      text: "Succès",
      data: contentsArray,
    });
  } catch (error) {
    logger.error("[getContentsForApp] error while getting dispositifs", {
      error: error.message,
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({
          text: "Erreur interne",
        });
    }
  }
};
