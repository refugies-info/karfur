import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { LangueDoc } from "../../../schema/schemaLangue";
import { indexableTags } from "../../../modules/search/data";
interface Query {
}

const extractValuesPerLanguage = (object: any, keyPrefix: string) => {
  if (!object) return {};
  if (typeof object !== "object") { // if object is string
    return { [`${keyPrefix}_fr`]: object }
  }
  const normalizedObject: any = {};
  for (const [ln, value] of Object.entries(object)) {
    normalizedObject[`${keyPrefix}_${ln}`] = value;
  }
  return normalizedObject;
}

/* DISPOSITIFS */
const getDispositifs = async () => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    tags: 1,
    needs: 1,
    typeContenu: 1,
    nbVues: 1,
  };

  const initialQuery = { status: "Actif" };

  const contentsArray = await getActiveContentsFiltered(
    neededFields,
    initialQuery
  );

  return contentsArray.map((content: any) => {
    const tags = content.tags.map((t: any) => t ? t.name : null).filter((t: any) => t !== null);

    return {
      objectID: content._id,
      ...extractValuesPerLanguage(content.titreInformatif, "title"),
      ...extractValuesPerLanguage(content.titreMarque, "titreMarque"),
      ...extractValuesPerLanguage(content.abstract, "abstract"),
      tags: tags,
      needs: content.needs,
      nbVues: content.nbVues,
      typeContenu: content.typeContenu,
      sponsorUrl: content?.mainSponsor?.picture?.secure_url,
      sponsorName: content?.mainSponsor?.nom,
      priority: content.typeContenu === "dispositif" ? 30 : 40,
    }
  });
}

/* NEEDS */
const getAllNeedTitles = (need: any, activeLanguages: LangueDoc[]) => {
  const titles: any = {};
  for (const ln of activeLanguages) {
    if (need[ln.i18nCode]) {
      titles["title_" + ln.i18nCode] = need[ln.i18nCode].text;
    }
  }
  return titles;
}

const getNeeds = async () => {
  const needs = await getNeedsFromDB();
  const activeLanguages = await getActiveLanguagesFromDB();

  return needs.map((need: any) => {
    return {
      objectID: need._id,
      ...getAllNeedTitles(need, activeLanguages),
      tagName: need.tagName,
      typeContenu: "besoin",
      priority: 20,
    }
  });
}

// REQUEST
export const getContent = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    logger.info("[getContent] received");

    const needs = await getNeeds();
    const dispositifs = await getDispositifs();

    res.status(200).json({
      text: "Succès",
      data: [
        ...indexableTags,
        ...needs,
        ...dispositifs
      ]
    });
  } catch (error) {
    logger.error("[getContent] error", {
      error: error.message,
    });
    res.status(500).json({ text: "KO" });
  }
};
