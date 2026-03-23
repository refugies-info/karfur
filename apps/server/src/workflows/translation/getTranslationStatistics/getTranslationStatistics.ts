import {
  RoleName,
  type Statistics,
  type TranslationStatisticsRequest,
} from "@refugies-info/api-types";

import logger from "~/logger";
import { getWordsTranslatedCounter } from "~/modules/adminOptions/adminOptions.repository";
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getUsersForTranslationStats } from "~/modules/users/users.repository";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const hasRole = (user: { roles: { nom: string }[] }, roleName: string): boolean =>
  Array.isArray(user.roles) && user.roles.some((role) => role.nom === roleName);

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

      // nbWordsTranslated — reads pre-computed stored counter (O(1), no full scan)
      if (noFacet || facets.includes("nbWordsTranslated")) {
        stats.nbWordsTranslated = await getWordsTranslatedCounter();
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
