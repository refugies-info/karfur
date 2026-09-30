import { publicOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import type { FiltersState } from "~/components/Pages/learnFrench";
import type { ActiveFilterBadge } from "~/components/Pages/learnFrench/MobileToolbar";
import { getFrenchLevelOptionLabel } from "~/lib/learnFrench/frenchLevelLabels";

interface Params {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  needLabels: Map<string, string>;
  search: string;
  onSearchChange: (search: string) => void;
}

export const useActiveFilters = (params: Params) => {
  const { t } = useTranslation();
  const { filters, onFiltersChange, needLabels, search, onSearchChange } = params;

  return useMemo(() => {
    const badges: ActiveFilterBadge[] = [
      ...filters.frenchLevel.map((option) => ({
        key: `level-${option}`,
        label: getFrenchLevelOptionLabel(option, t),
        onRemove: () =>
          onFiltersChange({
            ...filters,
            frenchLevel: filters.frenchLevel.filter((value) => value !== option),
          }),
      })),
      ...filters.categories.map((id) => ({
        key: `category-${id}`,
        label: needLabels.get(String(id)) ?? String(id),
        onRemove: () =>
          onFiltersChange({
            ...filters,
            categories: filters.categories.filter((value) => value !== id),
          }),
      })),
      ...filters.publicFilter.map((value) => ({
        key: `public-${value}`,
        label: t(publicOptions.find((option) => option.key === value)?.value ?? value, value),
        onRemove: () =>
          onFiltersChange({
            ...filters,
            publicFilter: filters.publicFilter.filter((current) => current !== value),
          }),
      })),
    ];
    if (search) {
      badges.push({ key: "search", label: search, onRemove: () => onSearchChange("") });
    }

    const filterGroupCount = [
      filters.departments.length + filters.cities.length,
      filters.frenchLevel.length,
      filters.categories.length,
      filters.publicFilter.length,
    ].filter((count) => count > 0).length;

    return { badges, filterGroupCount };
  }, [filters, onFiltersChange, needLabels, search, onSearchChange, t]);
};
