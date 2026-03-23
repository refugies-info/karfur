import {
  RoleName,
  type Statistics,
  type TranslationStatisticsRequest,
} from "@refugies-info/api-types";
import type { Dispositif } from "@refugies-info/mongo";

import { countDispositifWords } from "~/libs/wordCounter";
import logger from "~/logger";
import {
  getAvailableLanguages,
  getDispositifTranslation,
} from "~/modules/dispositif/dispositif.business";
import { getActiveContentsFiltered } from "~/modules/dispositif/dispositif.repository";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getUsersForTranslationStats } from "~/modules/users/users.repository";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const hasRole = (user: { roles: { nom: string }[] }, roleName: string): boolean =>
  Array.isArray(user.roles) && user.roles.some((role) => role.nom === roleName);

const countWordsInDispositif = (dispositif: Dispositif): number => {
  const languages = getAvailableLanguages(dispositif);
  return languages
    .map((ln) => {
      if (ln === "fr") return 0;
      const translation = getDispositifTranslation(dispositif, ln as any, false);
      return countDispositifWords(translation?.content as any);
    })
    .reduce((acc, count) => acc + count, 0);
};

const getTranslationStatistics = ({
  facets = [],
}: TranslationStatisticsRequest): Promise<Statistics> =>
  Promise.all([getActiveLanguagesFromDB(), getUsersForTranslationStats()]).then(
    async ([languages, users]) => {
      logger.info("[getTranslationStatistics] get translations statistics");
      const noFacet = facets.length === 0;
      const stats: Statistics = {};
      const trads = users.filter((user) => hasRole(user, RoleName.TRAD));
      // nbTranslators
      if (noFacet || facets.includes("nbTranslators") || facets.includes("nbActiveTranslators")) {
        stats.nbTranslators = trads.length;
      }

      // nbRedactors
      if (noFacet || facets.includes("nbRedactors")) {
        const redactors = users.filter((user) => hasRole(user, RoleName.CONTRIB));
        stats.nbRedactors = redactors.length;
      }

      // nbWordsTranslated
      // TODO: Pre-compute nbWordsTranslated as a stored counter (updated on content save/publish)
      // to eliminate O(dispositifs × languages) word counting. This is the most expensive facet —
      // it loads every active dispositif and counts words across all translations in-memory.
      // getActiveContentsFiltered uses speedgoose .cacheQuery() — DB hit only on first call
      // or after a Dispositif write (SpeedGooseCacheAutoCleaner auto-invalidates)
      if (noFacet || facets.includes("nbWordsTranslated")) {
        const dispositifs = await getActiveContentsFiltered({}, {});
        stats.nbWordsTranslated = dispositifs.reduce(
          (acc, dispositif) => acc + countWordsInDispositif(dispositif),
          0,
        );
      }

      // nbActiveTranslators
      if (noFacet || facets.includes("nbActiveTranslators")) {
        const now = Date.now();
        const activeTranslators = trads.filter(
          (user) => now - new Date(user.last_connected).getTime() <= ONE_MONTH,
        );
        const nbActiveTranslators = languages
          .filter((ln: any) => ln.i18nCode !== "fr")
          .map((language: any) => {
            const languageId = language._id.toString();
            const count = activeTranslators.filter((user) =>
              user.selectedLanguages
                .map((l: any) => l._id.toString())
                .includes(languageId.toString()),
            ).length;
            return { languageId, count };
          });
        stats.nbActiveTranslators = nbActiveTranslators;
      }

      return stats;
    },
  );

export default getTranslationStatistics;
