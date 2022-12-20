import { celebrate, Joi, Segments } from "celebrate";
import logger from "../../../logger";
import { getNbMercis, getNbVues, getNbFiches, getNbUpdatedRecently } from "../../../modules/dispositif/dispositif.repository";
import { Res, RequestFromClient } from "../../../types/interface";

type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";
interface Statistics {
  nbMercis?: number
  nbVues?: number
  nbVuesMobile?: number
  nbDispositifs?: number
  nbDemarches?: number
  nbUpdatedRecently?: number
}

const validator = celebrate({
  [Segments.QUERY]: Joi.object({
    facets: Joi.array().items(Joi.string().valid("nbMercis", "nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches", "nbUpdatedRecently")),
  })
});

interface Query {
  facets?: Facets[]
}

type Mercis = { mercis: number }
type Vues = { nbVues: number, nbVuesMobile: number }
type NbContent = { nbDispositifs: number, nbDemarches: number }

export const handler = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] dispositif");

    const noFacet = !req.query.facets?.length;
    const facets = req.query.facets || [];
    const data: Statistics = {};

    // nbMercis
    if (noFacet || facets.includes("nbMercis")) {
      const resMercis: Mercis[] = await getNbMercis();
      data.nbMercis = resMercis[0].mercis;
    }

    // nbVues & nbVuesMobile
    if (noFacet || facets.includes("nbVues") || facets.includes("nbVuesMobile")) {
      const resVues: Vues[] = await getNbVues();
      data.nbVues = resVues[0].nbVues;
      data.nbVuesMobile = resVues[0].nbVuesMobile;
    }

    // nbDispositifs & nbDemarches
    if (noFacet || facets.includes("nbDispositifs") || facets.includes("nbDemarches")) {
      const resNbFiches: NbContent = await getNbFiches();
      data.nbDispositifs = resNbFiches.nbDispositifs;
      data.nbDemarches = resNbFiches.nbDemarches;
    }

    // nbUpdatedRecently
    if (noFacet || facets.includes("nbUpdatedRecently")) {
      const lastTrimester = new Date();
      lastTrimester.setMonth(lastTrimester.getMonth() - 3);
      const nbUpdatedRecently = await getNbUpdatedRecently(lastTrimester);
      data.nbUpdatedRecently = nbUpdatedRecently;
    }

    return res
      .status(200)
      .json({
        text: "OK",
        data
      });
  } catch (error) {
    logger.error("[getStatistics] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};

export default [validator, handler];
