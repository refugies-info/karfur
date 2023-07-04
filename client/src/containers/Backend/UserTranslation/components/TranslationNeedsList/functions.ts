import { GetNeedResponse, Languages } from "@refugies-info/api-types";
import { colors } from "colors";

const isNotTranslated = (need: GetNeedResponse, ln: Languages) => {
  return (
    !need[ln]?.text || // no title translated
    (need.fr.subtitle && !need[ln]?.subtitle)
  ); // or no subtitle if defined in french
};

const isTranslationOutdated = (need: GetNeedResponse, ln: Languages) => {
  const translationUpdatedAt = need[ln]?.updatedAt;
  if (!need.fr.updatedAt || !translationUpdatedAt) return true;
  return need.fr.updatedAt > translationUpdatedAt;
};

export const getStatusColorAndText = (need: GetNeedResponse, langueI18nCode: Languages) => {
  if (isNotTranslated(need, langueI18nCode)) {
    return { statusColor: colors.blue, statusText: "À traduire" };
  }

  if (isTranslationOutdated(need, langueI18nCode)) {
    return { statusColor: colors.rouge, statusText: "À revoir" };
  }

  return { statusColor: colors.green, statusText: "Traduit" };
};
