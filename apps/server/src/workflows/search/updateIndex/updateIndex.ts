import { DispositifStatus, type UpdateIndexResponse } from "@refugies-info/api-types";
import type { Dispositif, Langue } from "@refugies-info/mongo";
import type { ProjectionType } from "mongoose";
import { getAllAlgoliaObjects } from "~/connectors/algolia/updateAlgoliaData";
import { formatForAlgolia } from "~/libs/formatForAlgolia";
import logger from "~/logger";
import { getActiveContentsFiltered } from "~/modules/dispositif/dispositif.repository";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getNeedsFromDB } from "~/modules/needs/needs.repository";
import { updateAlgoliaIndex } from "~/modules/search/search.service";
import { getAllThemes } from "~/modules/themes/themes.repository";
import type { AlgoliaObject, ResponseWithData } from "~/types/interface";

const getDispositifsForAlgolia = async (): Promise<AlgoliaObject[]> => {
  const neededFields: ProjectionType<Dispositif> = {
    translations: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    nbVues: 1,
    typeContenu: 1,
    webOnly: 1,
    mainSponsor: 1,
    metadatas: 1,
    origin: 1,
  };

  const contentsArray = await getActiveContentsFiltered(neededFields, {
    status: DispositifStatus.ACTIVE,
  });
  return contentsArray
    .map((content) => formatForAlgolia(content, [], "dispositif"))
    .filter((dispositif) => !!dispositif);
};

const getNeedsForAlgolia = async (activeLanguages: Langue[]): Promise<AlgoliaObject[]> => {
  const needs = await getNeedsFromDB();
  return (needs as any)
    .map((content: any) => formatForAlgolia(content, activeLanguages, "need"))
    .filter((need: any) => !!need);
};

const getThemesForAlgolia = async (activeLanguages: Langue[]): Promise<AlgoliaObject[]> => {
  const themes = await getAllThemes();
  return themes
    .map((theme) => formatForAlgolia(theme, activeLanguages, "theme"))
    .filter((theme) => !!theme);
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
