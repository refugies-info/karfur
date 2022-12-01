import logger from "../../../logger";
import { getNbMercis, getNbVues, getNbFiches } from "../../../modules/dispositif/dispositif.repository";
import { Res, RequestFromClient } from "../../../types/interface";

interface Query { }

type Mercis = { mercis: number }
type Vues = { nbVues: number, nbVuesMobile: number }

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics]");

    const resMercis: Mercis[] = await getNbMercis();
    const resVues: Vues[] = await getNbVues();
    const resNbFiches: number = await getNbFiches();

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbMercis: resMercis[0].mercis,
          nbVues: resVues[0].nbVues,
          nbVuesMobile: resVues[0].nbVuesMobile,
          nbFiches: resNbFiches
        }
      });
  } catch (error) {
    logger.error("[getStatistics] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
