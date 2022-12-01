import logger from "../../../logger";
import { getNbStructures } from "../../../modules/structure/structure.repository";
import { Res, RequestFromClient } from "../../../types/interface";

interface Query { }

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] get statistics for structure");

    const resNbStructures: number = await getNbStructures();

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbStructures: resNbStructures
        }
      });
  } catch (error) {
    logger.error("[getStatistics] structure error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
