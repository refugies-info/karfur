import { AlgoliaObject, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { updateAlgoliaIndex } from "../../../modules/search/search.service";
import { getAllAlgoliaObjects } from "../../../connectors/algolia/updateAlgoliaData";
import { formatForAlgolia } from "../../../libs/formatForAlgolia";
import { getAllThemes } from "../../../modules/themes/themes.repository";
import { UpdateIndexResponse } from "api-types";

const getDispositifsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    typeContenu: 1,
    nbVues: 1,
    webOnly: 1,
  };

  const contentsArray = await getActiveContentsFiltered(
    neededFields,
    { status: "Actif" }
  );
  return contentsArray.map((content) => formatForAlgolia(content, [], "dispositif"));
}

const getNeedsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const needs = await getNeedsFromDB();
  const activeLanguages = await getActiveLanguagesFromDB();
  //@ts-ignore
  return needs.map((content) => formatForAlgolia(content, activeLanguages, "need"));
}

const getThemesForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const themes = await getAllThemes();
  const activeLanguages = await getActiveLanguagesFromDB();
  return themes.map((theme) => formatForAlgolia(theme, activeLanguages, "theme"));
}

export const updateIndex = async (): ResponseWithData<UpdateIndexResponse> => {
  logger.info("[updateIndex] received");
  const themes = await getThemesForAlgolia();
  const needs = await getNeedsForAlgolia();
  const dispositifs = await getDispositifsForAlgolia();
  const localContents = [
    ...themes,
    ...needs,
    ...dispositifs
  ];

  const algoliaContents = await getAllAlgoliaObjects();
  const result = await updateAlgoliaIndex(localContents, algoliaContents);

  return {
    text: "success",
    data: result
  }
};
