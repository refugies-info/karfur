import logger from "../../../logger";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";

import { celebrate, Joi, Segments } from "celebrate";
import { map } from "lodash/fp";
import { omit } from "lodash";
import { Languages } from "src/typegoose";
import { RequestFromClient, Res } from "src/types/interface";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    query: Joi.object().required(),
    locale: Joi.string(),
    limit: Joi.number(),
    sort: Joi.string()
  })
});

export const handler = async (req: RequestFromClient<{ query: any }>, res: Res) => {
  logger.info("[getDispositifs] called");
  let { query, locale, limit, sort } = req.body;
  locale = (locale || "fr") as Languages;

  return getDispositifArray(query, {}, "", limit, sort)
    .then(
      map((dispositif) => ({
        ...omit(dispositif, ["translations"]),
        traduction: dispositif.translations[locale]
      }))
    )
    .then((result) =>
      res.status(200).json({
        text: "Succès",
        data: result
      })
    )
    .catch((error) => {
      logger.error("[getDispositifs] error while getting dispositifs", {
        error: error.message
      });
      switch (error) {
        case 500:
          res.status(500).json({
            text: "Erreur interne"
          });
          break;
        case 404:
          res.status(404).json({
            text: "Pas de résultat"
          });
          break;
        default:
          res.status(500).json({
            text: "Erreur interne"
          });
      }
    });
};

export default [validator, handler];
