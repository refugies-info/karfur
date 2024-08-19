import logger from "../../../logger";
import { getNbStructures, getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { ResponseWithData } from "../../../types/interface";
import { findAllRespo } from "../../../modules/structure/structure.service";
import { GetStructureStatisticsRequest, GetStructureStatisticsResponse } from "@refugies-info/api-types";

export const getStatistics = async (
  query: GetStructureStatisticsRequest,
): ResponseWithData<GetStructureStatisticsResponse> => {
  logger.info("[getStatistics] structure");

  const noFacet = !query.facets?.length;
  const facets = query.facets || [];
  const data: GetStructureStatisticsResponse = {};

  // nbStructures
  if (noFacet || facets.includes("nbStructures")) {
    const resNbStructures: number = await getNbStructures();
    data.nbStructures = resNbStructures;
  }

  // nbCDA
  if (noFacet || facets.includes("nbCDA")) {
    const cda = await getStructuresFromDB({ nom: "Comité de la Démarche Accessible" }, { membres: 1 });
    data.nbCDA = cda[0].membres.length;
  }

  // nbStructureAdmins
  if (noFacet || facets.includes("nbStructureAdmins")) {
    const structures = await getStructuresFromDB({ status: "Actif" }, { membres: 1 });
    const structureAdmins = findAllRespo(structures);
    data.nbStructureAdmins = structureAdmins.length;
  }

  return {
    text: "success",
    data,
  };
};
