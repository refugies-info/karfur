import { celebrate, Joi, Segments } from "celebrate";
import logger from "../../../logger";
import { getNbStructures, getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import { findAllRespo } from "../../../modules/structure/structure.service";

type Facets = "nbStructures" | "nbCDA" | "nbStructureAdmins";
interface Statistics {
  nbStructures?: number
  nbCDA?: number
  nbStructureAdmins?: number
}

const validator = celebrate({
  [Segments.QUERY]: Joi.object({
    facets: Joi.array().items(Joi.string().valid("nbStructures", "nbCDA", "nbStructureAdmins")),
  })
});

interface Query {
  facets?: Facets[]
}

export const handler = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] structure");

    const noFacet = !req.query.facets?.length;
    const facets = req.query.facets || [];
    const data: Statistics = {};

    // nbStructures
    if (noFacet || facets.includes("nbStructures")) {
      const resNbStructures: number = await getNbStructures();
      data.nbStructures = resNbStructures;
    }

    // nbCDA
    if (noFacet || facets.includes("nbCDA")) {
      const cda = await getStructuresFromDB({ nom: "Comité de la Démarche Accessible" }, { membres: 1 }, false);
      data.nbCDA = cda[0].membres.length;
    }

    // nbStructureAdmins
    if (noFacet || facets.includes("nbStructureAdmins")) {
      const structures = await getStructuresFromDB({ status: "Actif" }, { membres: 1 }, false);
      const structureAdmins = findAllRespo(structures);
      data.nbStructureAdmins = structureAdmins.length;
    }

    return res
      .status(200)
      .json({
        text: "OK",
        data
      });
  } catch (error) {
    logger.error("[getStatistics] structure error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};

export default [validator, handler];
