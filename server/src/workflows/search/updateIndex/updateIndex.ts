import { RequestFromClient, Res, AlgoliaObject } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { indexableTags } from "../../../modules/search/data";
import { updateAlgoliaIndex } from "../../../modules/search/search.service";
import { getAllAlgoliaObjects } from "../../../connectors/algolia/updateAlgoliaData";
import { formatForAlgolia } from "../../../libs/formatForAlgolia";

interface Query {
}

const getDispositifsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    tags: 1,
    needs: 1,
    typeContenu: 1,
    nbVues: 1,
  };

  const contentsArray = await getActiveContentsFiltered(
    neededFields,
    { status: "Actif" }
  );
  return contentsArray.map((content) => formatForAlgolia(content));
}

const getNeedsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const needs = await getNeedsFromDB();
  const activeLanguages = await getActiveLanguagesFromDB();
  return needs.map((content) => formatForAlgolia(content, activeLanguages));
}

// REQUEST
export const updateIndex = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    logger.info("[updateIndex] received");

    const needs = await getNeedsForAlgolia();
    const dispositifs = await getDispositifsForAlgolia();
    const localContents = [
      ...indexableTags,
      ...needs,
      ...dispositifs
    ];

    const algoliaContents = await getAllAlgoliaObjects();
    const result = await updateAlgoliaIndex(localContents, algoliaContents);

    res.status(200).json({
      text: "Succès",
      result
    });
  } catch (error) {
    logger.error("[updateIndex] error", {
      error: error.message,
    });
    res.status(500).json({ text: "KO" });
  }
};
