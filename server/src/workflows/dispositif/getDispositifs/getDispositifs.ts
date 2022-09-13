import { RequestFromClient, Res, IDispositif } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { removeUselessContent } from "../../../modules/dispositif/dispositif.adapter";
import {
  turnToLocalized,
  turnJSONtoHTML,
} from "../../../controllers/dispositif/functions";

interface Query {}

export const getDispositifs = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    if (!req.body || !req.body.query) {
      res.status(400).json({ text: "Requête invalide" });
    } else {
      logger.info("[getDispositifs] called");
      let { query, locale } = req.body;
      locale = locale || "fr";

      const dispositifArray = await getDispositifArray(query, {mainSponsor: 1}, "theme secondaryThemes mainSponsor");
      // @ts-ignore
      const adaptedDispositifArray = removeUselessContent(dispositifArray);
      const array: string[] = [];
      array.forEach.call(adaptedDispositifArray, (dispositif: IDispositif) => {
        turnToLocalized(dispositif, locale);
        turnJSONtoHTML(dispositif.contenu);
      });

      res.status(200).json({
        text: "Succès",
        data: adaptedDispositifArray,
      });
    }
  } catch (error) {
    logger.error("[getDispositifs] error while getting dispositifs", {
      error: error.message,
    });
    switch (error) {
      case 500:
        res.status(500).json({
          text: "Erreur interne",
        });
        break;
      case 404:
        res.status(404).json({
          text: "Pas de résultat",
        });
        break;
      default:
        res.status(500).json({
          text: "Erreur interne",
        });
    }
  }
};
