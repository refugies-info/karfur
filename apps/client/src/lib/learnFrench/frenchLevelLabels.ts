import { type FrenchOptions, frenchLevelValuesByOption } from "data/searchFilters";
import type { TFunction } from "next-i18next";

export const getFrenchLevelOptionLabel = (option: FrenchOptions, t: TFunction): string =>
  option === "alpha"
    ? t("Filters.frenchLevelAlpha", "Alpha")
    : frenchLevelValuesByOption[option].join("/");
