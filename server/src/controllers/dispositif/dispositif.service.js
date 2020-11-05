const logger = require("../../logger");
import Dispositif from "../../schema/schemaDispositif";
import { turnToLocalized, turnJSONtoHTML } from "./functions";

const getDispositifArray = async (query) => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    contenu: 1,
    tags: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
  };
  if (query["audienceAge.bottomValue"]) {
    var modifiedQuery = Object.assign({}, query);

    delete modifiedQuery["audienceAge.bottomValue"];

    delete modifiedQuery["audienceAge.topValue"];
    var newQuery = {
      $or: [
        query,
        {
          "variantes.bottomValue": query["audienceAge.bottomValue"],

          "variantes.topValue": query["audienceAge.topValue"],
          ...modifiedQuery,
        },
      ],
    };
    return await Dispositif.find(newQuery, neededFields);
  }
  return await Dispositif.find(query, neededFields);
};

export const getDispositifs = async (req, res) => {
  try {
    if (!req.body || !req.body.query) {
      res.status(400).json({ text: "Requête invalide" });
    } else {
      logger.info("[getDispositifs] called");
      let { query, locale } = req.body;
      locale = locale || "fr";

      const dispositifArray = await getDispositifArray(query);
      const array = [];

      array.forEach.call(dispositifArray, (dispositif) => {
        dispositif = turnToLocalized(dispositif, locale);
        turnJSONtoHTML(dispositif.contenu);
      });

      res.status(200).json({
        text: "Succès",
        data: dispositifArray,
      });
    }
  } catch (error) {
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
