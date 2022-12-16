import logger from "../../../logger";
import { getNbStructures, getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import { findAllRespo } from "../../../modules/structure/structure.service";

interface Query { }

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] get statistics for structure");

    // nbStructures
    const resNbStructures: number = await getNbStructures();

    // nbCDA
    const cda = await getStructuresFromDB({ nom: "Comité de la Démarche Accessible" }, { membres: 1 }, false);

    // nbStructureAdmins
    const structures = await getStructuresFromDB({ status: "Actif" }, { membres: 1 }, false);
    const structureAdmins = findAllRespo(structures);

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbStructures: resNbStructures,
          nbCDA: cda[0].membres.length,
          nbStructureAdmins: structureAdmins.length
        }
      });
  } catch (error) {
    logger.error("[getStatistics] structure error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
