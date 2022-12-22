import { IDispositif } from "../../../types/interface";
import logger from "../../../logger";
import { Request, Response } from "express";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { removeUselessContent } from "../../../modules/dispositif/dispositif.adapter";
import {
  turnToLocalized,
  turnJSONtoHTML,
} from "../../../controllers/dispositif/functions";
import { celebrate, Joi, Segments } from "celebrate";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    query: Joi.object().required(),
    locale: Joi.string(),
    limit: Joi.number(),
    sort: Joi.string()
  })
});

export const handler = async (req: Request, res: Response) => {
  try {
    logger.info("[getDispositifs] called");
    let { query, locale, limit, sort } = req.body;
    locale = locale || "fr";

    const dispositifArray = await getDispositifArray(
      query,
      { mainSponsor: 1, needs: 1, lastModificationDate: 1 },
      "mainSponsor",
      limit || 0,
      sort ? { [sort]: -1 } : {}
    );

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

export default [validator, handler];
