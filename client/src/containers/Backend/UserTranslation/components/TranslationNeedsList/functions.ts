import { GetNeedResponse } from "@refugies-info/api-types";
import { colors } from "colors";
import { AvailableLanguageI18nCode } from "types/interface";

const isNotTranslated = (need: GetNeedResponse, ln: AvailableLanguageI18nCode) => {
  return (
    !need[ln]?.text || // no title translated
    (need.fr.subtitle && !need[ln]?.subtitle)
  ); // or no subtitle if defined in french
};

const isTranslationOutdated = (need: GetNeedResponse, ln: AvailableLanguageI18nCode) => {
  const translationUpdatedAt = need[ln]?.updatedAt;
  if (!need.fr.updatedAt || !translationUpdatedAt) return true;
  return need.fr.updatedAt > translationUpdatedAt;
};

export const getStatusColorAndText = (need: GetNeedResponse, langueI18nCode: AvailableLanguageI18nCode) => {
  if (!langueI18nCode) {
    return { statusColor: colors.darkGrey, statusText: "Erreur" };
  }

  if (isNotTranslated(need, langueI18nCode)) {
    return { statusColor: colors.blue, statusText: "À traduire" };
  }

  if (isTranslationOutdated(need, langueI18nCode)) {
    return { statusColor: colors.rouge, statusText: "À revoir" };
  }

  return { statusColor: colors.green, statusText: "À jour" };
};
