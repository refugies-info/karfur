import logger = require("../../logger");
import { RequestFromClient, Res } from "../../types/interface.js";
import {
  getStructureFromDB,
  getStructuresFromDB,
} from "./structure.repository";
import { castToBoolean } from "../../libs/castToBoolean";

interface Query {
  id: string;
  withDisposAssocies: string;
}

export const getStructureById = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  if (!req.query || !req.query.id) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const { id, withDisposAssocies } = req.query;
    const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);

    logger.info("[getStructureById] get structure with id", {
      id,
      withDisposAssociesBoolean,
    });

    const structure = await getStructureFromDB(
      id,
      withDisposAssociesBoolean || false
    );
    if (!structure) {
      throw new Error("No structure");
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
