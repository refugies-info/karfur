import logger = require("src/logger");
import Structure from "../../schema/schemaStructure.js";
import { RequestFromClient, Res } from "src/types/interface.js";

export const getStructureByIdWithDispositifsAssocies = async (
  req: RequestFromClient,
  res: Res
) => {
  if (!req.query || !req.query.id) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const structureId = req.query.id;
    logger.info(
      "[getStructureByIdWithDispositifsAssocies] get structure with id",
      { structureId }
    );
    const structure = await Structure.find({ _id: structureId }).populate(
      "dispositifsAssocies"
    );

    if (!structure) {
      throw new Error("No structure");
    }

    return res.status(200).json({
      text: "Succès",
      data: structure,
    });
  } catch (error) {
    logger.error(
      "[getStructureByIdWithDispositifsAssocies] error while getting structure with id"
    );
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
