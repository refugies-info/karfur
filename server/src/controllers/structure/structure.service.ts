import logger = require("../../logger");
import { RequestFromClient, Res } from "src/types/interface.js";
import { getStructureFromDB } from "./structure.repository";

interface Query {
  id: string;
  withDisposAssocies: boolean;
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

    logger.info("[getStructureById] get structure with id", {
      id,
      withDisposAssocies,
    });

    const structure = await getStructureFromDB(id, withDisposAssocies || false);

    if (!structure) {
      throw new Error("No structure");
    }

    return res.status(200).json({
      text: "Succès",
      data: structure,
    });
  } catch (error) {
    logger.error("[getStructureById] error while getting structure with id");
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
