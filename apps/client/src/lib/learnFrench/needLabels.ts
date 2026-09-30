import type { GetNeedResponse } from "@refugies-info/api-types";
import type { AvailableLanguageI18nCode } from "~/types/interface";

export const getNeedLabel = (need: GetNeedResponse, locale: AvailableLanguageI18nCode): string => {
  const translation = need[locale];
  return translation?.short || translation?.text || need.fr.short || need.fr.text;
};

export const buildNeedLabels = (
  needs: GetNeedResponse[],
  locale: AvailableLanguageI18nCode,
): Map<string, string> =>
  new Map(needs.map((need) => [String(need._id), getNeedLabel(need, locale)]));
