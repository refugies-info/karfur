import logger from "../../../logger";
import { getAllUsersForAdminFromDB } from "../../../modules/users/users.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Statistics, TranslationStatisticsRequest } from "@refugies-info/api-types";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { Dispositif } from "../../../typegoose";
import { DemarcheContent, DispositifContent } from "../../../typegoose/Dispositif";
import { countWords, countWordsForInfoSections } from "../../../typegoose/Traductions";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const countWordsInDispositif = (dispositif: Dispositif): number =>
  Object.entries(dispositif.translations)
    .map(([ln, translation]) =>
      ln === "fr"
        ? 0
        : countWords(translation.content?.titreInformatif) +
          countWords(translation.content?.titreMarque) +
          countWords(translation.content?.abstract) +
          countWords(translation.content?.what) +
          countWordsForInfoSections(translation.content?.how) +
          countWordsForInfoSections((translation.content as DemarcheContent)?.next) +
          countWordsForInfoSections((translation.content as DispositifContent)?.why),
    )
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
      const nbWordsTranslated = await getActiveContentsFiltered({}, {}).then((dispositifs) =>
        dispositifs.reduce((acc, dispositif) => acc + countWordsInDispositif(dispositif), 0),
      );
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
