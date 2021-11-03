import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { LangueDoc } from "../../../schema/schemaLangue";

interface Query {
}

const getAllTitles = (need: any, activeLanguages: LangueDoc[]) => {
  const titles: any = {};
  for (const ln of activeLanguages) {
    if (need[ln.i18nCode]) {
      titles["title_" + ln.i18nCode] = need[ln.i18nCode].text;
    }
  }
  return titles;
}

export const getNeeds = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    logger.info("[getNeeds] received");

    const needs = await getNeedsFromDB();
    const activeLanguages = await getActiveLanguagesFromDB();

    const needsArrayNormalized = needs.map((need: any) => {
      return {
        objectID: need._id,
        ...getAllTitles(need, activeLanguages),
        tagName: need.tagName,
        typeContenu: "besoin",
      }
    });

    res.status(200).json({
      text: "Succès",
      data: needsArrayNormalized
    });
  } catch (error) {
    logger.error("[getNeeds] error", {
      error: error.message,
    });
    res.status(500).json({ text: "KO" });
  }
};
