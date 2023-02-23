
import { GetStatisticsRequest, GetStatisticsResponse } from "api-types";
import logger from "../../../logger";
import { getNbMercis, getNbVues, getNbFiches, getNbUpdatedRecently } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";

type Mercis = { mercis: number }
type Vues = { nbVues: number, nbVuesMobile: number }
type NbContent = { nbDispositifs: number, nbDemarches: number }

export const getStatistics = async (query: GetStatisticsRequest): ResponseWithData<GetStatisticsResponse> => {
  logger.info("[getStatistics] dispositif");

  const noFacet = !query.facets?.length;
  const facets = query.facets || [];
  const data: GetStatisticsResponse = {};

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

  return {
    text: "success",
    data
  }
};
