import logger from "../../../logger";
import { getAllUsersForAdminFromDB } from "../../../modules/users/users.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Statistics, TranslationStatisticsRequest } from "@refugies-info/api-types";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif } from "../../../typegoose";
import { countDispositifWords } from "../../../libs/wordCounter";
import { cache } from "../../../libs/cache";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
const NB_WORDS_CACHE = "nbWordsCache";

const countWordsInDispositif = (dispositif: Dispositif): number =>
  Object.entries(dispositif.translations)
    .map(([ln, translation]) => ln === "fr" ? 0 : countDispositifWords(translation.content))
    .reduce((acc, count) => acc + count, 0);

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
      let nbWordsTranslated = 0;
      // use cache to prevent multiple calculations, especially at build time
      if (cache.has(NB_WORDS_CACHE)) {
        const promiseCalculation = (await cache.get(NB_WORDS_CACHE)) as number;
        nbWordsTranslated = promiseCalculation;
      } else {
        const promiseCalculation = getActiveContentsFiltered({}, {}).then((dispositifs) =>
          dispositifs.reduce((acc, dispositif) => acc + countWordsInDispositif(dispositif), 0)
        );
        cache.set(NB_WORDS_CACHE, promiseCalculation, 120);
        nbWordsTranslated = await promiseCalculation;
      }
      stats.nbWordsTranslated = nbWordsTranslated;
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
          const languageId = language._id.toString();
          const count = activeTranslators.filter((user) =>
            user.selectedLanguages.map((l) => l._id.toString()).includes(languageId.toString()),
          ).length;
          return { languageId, count };
        });
      stats.nbActiveTranslators = nbActiveTranslators;
    }

    return stats;
  });

export default getTranslationStatistics;
