const logger = require("../../logger");
import Dispositif from "../../schema/schemaDispositif";
import { turnToLocalized, turnJSONtoHTML } from "./functions";
import { Res, RequestFromClient, IDispositif } from "../../types/interface";

const getDispositifArray = async (query: any) => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    contenu: 1,
    tags: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    avancement: 1,
    status: 1,
    nbMots: 1,
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
    return await Dispositif.find(newQuery, neededFields).lean();
  }
  return await Dispositif.find(query, neededFields).lean();
};

const removeUselessContent = (dispositifArray: IDispositif[]) =>
  dispositifArray.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.map(
      (child: any) => {
        if (child.title === "Zone d'action") {
          return child;
        }
        return [];
      }
    );

    const simplifiedContent = [{}, { children: selectZoneAction }];

    return { ...dispositif, contenu: simplifiedContent };
  });

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

      const dispositifArray = await getDispositifArray(query);
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
    logger.error("[getDispositifs] error while getting dispositifs", { error });
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

export const getAllDispositifs = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllDispositifs] called");

    // const dispositifArray = await getDispositifArray(query);
    // const adaptedDispositifArray = removeUselessContent(dispositifArray);
    // const array = [];

    // array.forEach.call(adaptedDispositifArray, (dispositif) => {
    //   turnToLocalized(dispositif, locale);
    //   turnJSONtoHTML(dispositif.contenu);
    // });

    res.status(200).json({
      text: "Succès",
      // data: adaptedDispositifArray,
    });
  } catch (error) {
    logger.error("[getAllDispositifs] error while getting dispositifs", {
      error,
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
