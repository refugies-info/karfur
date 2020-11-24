import logger = require("../../logger");
import { RequestFromClient, Res } from "../../types/interface.js";
import {
  getStructureFromDB,
  getStructuresFromDB,
} from "./structure.repository";
import { castToBoolean } from "../../libs/castToBoolean";
import { turnToLocalized, turnJSONtoHTML } from "../dispositif/functions";

interface Query {
  id: string;
  withDisposAssocies: string;
  localeOfLocalizedDispositifsAssocies: string;
}

export const getStructureById = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  if (!req.query || !req.query.id) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const {
      id,
      withDisposAssocies,
      localeOfLocalizedDispositifsAssocies,
    } = req.query;
    const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);

    const withLocalizedDispositifsBoolean = [
      "fr",
      "en",
      "ru",
      "ps",
      "ar",
      "fa",
      "ti-ER",
    ].includes(localeOfLocalizedDispositifsAssocies);

    logger.info("[getStructureById] get structure with id", {
      id,
      withDisposAssociesBoolean,
      withLocalizedDispositifsBoolean,
      localeOfLocalizedDispositifsAssocies,
    });

    const populateDisposAssocies = withLocalizedDispositifsBoolean
      ? true
      : withDisposAssociesBoolean
      ? true
      : false;

    const fields = "all";
    const structure = await getStructureFromDB(
      id,
      populateDisposAssocies,
      fields
    );
    if (!structure) {
      throw new Error("No structure");
    }

    if (withLocalizedDispositifsBoolean) {
      const dispositifsAssocies = structure.toJSON().dispositifsAssocies;
      const array: string[] = [];

      array.forEach.call(dispositifsAssocies, (dispositif: any) => {
        turnToLocalized(dispositif, localeOfLocalizedDispositifsAssocies);
        turnJSONtoHTML(dispositif.contenu);
      });

      const newStructure = { ...structure.toJSON(), dispositifsAssocies };
      return res.status(200).json({
        text: "Succès",
        data: newStructure,
      });
    }

    return res.status(200).json({
      text: "Succès",
      data: structure,
    });
  } catch (error) {
    logger.error("[getStructureById] error while getting structure with id", {
      error,
    });
    if (error.message === "No structure") {
      res.status(404).json({
        text: "Pas de résultat",
      });
      return;
    }
    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB();
    return res.status(200).json({ data: structures });
  } catch (error) {
    logger.error("[getActiveStructures] error while getting structures", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
