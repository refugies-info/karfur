import { GetNeedResponse, Languages } from "@refugies-info/api-types";
import { NeedTradStatus } from "../../types";

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

export const getStatus = (need: GetNeedResponse, langueI18nCode: Languages): NeedTradStatus => {
  if (isNotTranslated(need, langueI18nCode)) return NeedTradStatus.TO_TRANSLATE;
  if (isTranslationOutdated(need, langueI18nCode)) return NeedTradStatus.TO_REVIEW;
  return NeedTradStatus.TRANSLATED;
};
