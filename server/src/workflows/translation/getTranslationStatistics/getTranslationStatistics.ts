import logger from "../../../logger";
import { getAllUsersForAdminFromDB } from "../../../modules/users/users.repository";
import { getNbWordsTranslated } from "../../../modules/traductions/traductions.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Statistics, TranslationStatisticsRequest } from "@refugies-info/api-types";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const getTranslationStatistics = ({ facets = [] }: TranslationStatisticsRequest): Promise<Statistics> =>
  Promise.all([
    getActiveLanguagesFromDB(),
    getAllUsersForAdminFromDB({ roles: 1, last_connected: 1, selectedLanguages: 1 }),
  ]).then(async ([languages, users]) => {
    logger.info("[getTranslationStatistics] get translations statistics");
    const noFacet = facets.length === 0;
    const stats: Statistics = {};
    const trads = users.filter((user) => user.hasRole("Trad"));
    // nbTranslators
    if (noFacet || facets.includes("nbTranslators") || facets.includes("nbActiveTranslators")) {
      stats.nbTranslators = trads.length;
    }

    // nbRedactors
    if (noFacet || facets.includes("nbRedactors")) {
      const redactors = users.filter((user) => user.hasRole("Contrib"));
      stats.nbRedactors = redactors.length;
    }

    // nbWordsTranslated
    if (noFacet || facets.includes("nbWordsTranslated")) {
      const nbWordsTranslated = await getNbWordsTranslated();
      stats.nbWordsTranslated = nbWordsTranslated?.[0]?.wordsCount || 0;
    }

    // nbActiveTranslators
    if (noFacet || facets.includes("nbActiveTranslators")) {
      const now = Date.now();
      const activeTranslators = trads.filter(
        (user) => user.hasRole("Trad") && now - new Date(user.last_connected).getTime() <= ONE_MONTH,
      );
      const nbActiveTranslators = languages
        .filter((ln) => ln.i18nCode !== "fr")
        .map((language) => {
          const languageId = language._id;
          const count = activeTranslators.filter((user) =>
            user.selectedLanguages.map((l) => l._id.toString()).includes(languageId),
          ).length;
          return { languageId, count };
        });
      stats.nbActiveTranslators = nbActiveTranslators;
    }

    return stats;
  });

export default getTranslationStatistics;
