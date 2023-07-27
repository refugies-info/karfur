import { DispositifStatus, UpdateIndexResponse } from "@refugies-info/api-types";

import { Langue } from "../../../typegoose";

import { AlgoliaObject, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { updateAlgoliaIndex } from "../../../modules/search/search.service";
import { getAllAlgoliaObjects } from "../../../connectors/algolia/updateAlgoliaData";
import { formatForAlgolia } from "../../../libs/formatForAlgolia";
import { getAllThemes } from "../../../modules/themes/themes.repository";

const getDispositifsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const neededFields = {
    translations: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    nbVues: 1,
    typeContenu: 1,
    webOnly: 1,
    mainSponsor: 1
  };

  const contentsArray = await getActiveContentsFiltered(neededFields, { status: DispositifStatus.ACTIVE });
  return contentsArray.map((content) => formatForAlgolia(content, [], "dispositif"));
};

const getNeedsForAlgolia = async (activeLanguages: Langue[]): Promise<AlgoliaObject[]> => {
  const needs = await getNeedsFromDB();
  //@ts-ignore
  return needs.map((content) => formatForAlgolia(content, activeLanguages, "need"));
};

const getThemesForAlgolia = async (activeLanguages: Langue[]): Promise<AlgoliaObject[]> => {
  const themes = await getAllThemes();
  return themes.map((theme) => formatForAlgolia(theme, activeLanguages, "theme"));
};

export const updateIndex = async (): ResponseWithData<UpdateIndexResponse> => {
  logger.info("[updateIndex] received");
  const activeLanguages = await getActiveLanguagesFromDB();
  const themes = await getThemesForAlgolia(activeLanguages);
  const needs = await getNeedsForAlgolia(activeLanguages);
  const dispositifs = await getDispositifsForAlgolia();
  const localContents = [...themes, ...needs, ...dispositifs];

  const algoliaContents = await getAllAlgoliaObjects();
  const result = await updateAlgoliaIndex(localContents, algoliaContents);

  return {
    text: "success",
    data: result,
  };
};
