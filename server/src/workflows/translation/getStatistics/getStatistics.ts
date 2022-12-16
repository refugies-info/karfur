import logger from "../../../logger";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { getNbWordsTranslated } from "../../../modules/traductions/traductions.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

interface Query { }

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] get translations statistics");

    const languages = await getActiveLanguagesFromDB();
    const users = await getAllUsersFromDB({ roles: 1, last_connected: 1, selectedLanguages: 1 }, "roles");

    // nbTranslators
    const translators = users.filter((x: any) =>
      (x.roles || []).some((role: any) => role.nom === "Trad")
    );

    // nbRedactors
    const redactors = users.filter((x: any) =>
      (x.roles || []).some((role: any) => role.nom === "Contrib")
    );

    // nbWordsTranslated
    const nbWordsTranslated = await getNbWordsTranslated();

    // nbActiveTranslators
    const now = Date.now();
    const activeTranslators = translators.filter(user => now - new Date(user.last_connected).getTime() <= ONE_MONTH);
    const nbActiveTranslators = languages.filter(ln => ln.i18nCode !== "fr").map(language => {
      const languageId = language._id.toString();
      const count = activeTranslators.filter(user =>
        user.selectedLanguages.map(l => l._id.toString()).includes(languageId)
      ).length;

      return { languageId, count }
    });

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbTranslators: translators.length,
          nbRedactors: redactors.length,
          nbWordsTranslated: nbWordsTranslated?.[0]?.wordsCount || 0,
          nbActiveTranslators: nbActiveTranslators
        }
      });
  } catch (error) {
    logger.error("[getStatistics] translations error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
