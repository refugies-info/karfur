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

const getTranslationStatistics = async ({
  facets = [],
}: TranslationStatisticsRequest): Promise<Statistics> => {
  logger.info("[getTranslationStatistics] get translations statistics");
  const noFacet = facets.length === 0;
  const stats: Statistics = {};

  // Users + languages are cached via speedgoose — failures here return partial results
  let languages: Awaited<ReturnType<typeof getActiveLanguagesFromDB>> = [];
  let users: Awaited<ReturnType<typeof getUsersForTranslationStats>> = [];
  try {
    [languages, users] = await Promise.all([
      getActiveLanguagesFromDB(),
      getUsersForTranslationStats(),
    ]);
  } catch (error: any) {
    logger.error("[getTranslationStatistics] failed to fetch users/languages", {
      error: error.message,
    });
  }

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

  // nbWordsTranslated — reads pre-computed stored counter (O(1), cached via speedgoose)
  if (noFacet || facets.includes("nbWordsTranslated")) {
    try {
      stats.nbWordsTranslated = await getWordsTranslatedCounter();
    } catch (error: any) {
      logger.error("[getTranslationStatistics] failed to fetch words translated counter", {
        error: error.message,
      });
      stats.nbWordsTranslated = 0;
    }
  }

  // nbActiveTranslators — single-pass O(U×S + L) instead of O(L×U×S)
  if (noFacet || facets.includes("nbActiveTranslators")) {
    const now = Date.now();
    const activeTranslators = trads.filter(
      (user) => now - new Date(user.last_connected).getTime() <= ONE_MONTH,
    );

    const languageCounts = new Map<string, number>();
    for (const user of activeTranslators) {
      for (const lang of user.selectedLanguages) {
        const id = lang._id?.toString();
        if (id) {
          languageCounts.set(id, (languageCounts.get(id) || 0) + 1);
        }
      }
    }

    const nbActiveTranslators = languages
      .filter((ln: any) => ln.i18nCode !== "fr")
      .map((language: any) => {
        const languageId = language._id?.toString();
        return { languageId, count: languageId ? languageCounts.get(languageId) || 0 : 0 };
      });
    stats.nbActiveTranslators = nbActiveTranslators;
  }

  return stats;
};

export default getTranslationStatistics;
