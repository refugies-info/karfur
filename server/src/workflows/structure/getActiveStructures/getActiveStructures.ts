import { Res } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, structureTypes: 1, departments: 1 },
      false
    );
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
