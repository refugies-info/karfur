import logger from "../../../logger";
import { getNbMercis, getNbVues, getNbFiches, getNbUpdatedRecently } from "../../../modules/dispositif/dispositif.repository";
import { Res, RequestFromClient } from "../../../types/interface";

interface Query { }

type Mercis = { mercis: number }
type Vues = { nbVues: number, nbVuesMobile: number }
type NbContent = { nbDispositifs: number, nbDemarches: number }

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics]");

    const resMercis: Mercis[] = await getNbMercis();
    const resVues: Vues[] = await getNbVues();
    const resNbFiches: NbContent = await getNbFiches();

    const lastTrimester = new Date();
    lastTrimester.setMonth(lastTrimester.getMonth() - 3);
    const nbUpdatedRecently = await getNbUpdatedRecently(lastTrimester);

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbMercis: resMercis[0].mercis,
          nbVues: resVues[0].nbVues,
          nbVuesMobile: resVues[0].nbVuesMobile,
          nbDispositifs: resNbFiches.nbDispositifs,
          nbDemarches: resNbFiches.nbDemarches,
          nbUpdatedRecently
        }
      });
  } catch (error) {
    logger.error("[getStatistics] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
