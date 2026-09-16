import type { GetNeedResponse, Id } from "@refugies-info/api-types";
import type { FrenchOptions, PublicOptions } from "data/searchFilters";
import { frenchLevelFilter, publicOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import { LocationFilter } from "~/components/Pages/learnFrench/LocationFilter";
import FilterButton from "~/components/UI/FilterButton/FilterButton";
import useLocale from "~/hooks/useLocale";

export interface FiltersState {
  departments: string[];
  cities: string[];
  frenchLevel: FrenchOptions[];
  categories: Id[];
  publicFilter: PublicOptions[];
}

interface Props {
  filters: FiltersState;
  categoryOptions: GetNeedResponse[];
  onChange: (filters: FiltersState) => void;
  onReset: () => void;
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const FiltersSidebar = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { filters } = props;

  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.cities.length > 0 ||
    filters.frenchLevel.length > 0 ||
    filters.categories.length > 0 ||
    filters.publicFilter.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h6 mb-0">{t("LearnFrench.filters_title", "Filtrer")}</h2>
        {hasActiveFilters && (
          <button type="button" className="text-title-blue-france text-sm" onClick={props.onReset}>
            {t("LearnFrench.filters_reset", "Réinitialiser")}
          </button>
        )}
      </div>

      <div>
        <h3 className="text-label-grey mb-3 flex items-center gap-2 text-sm font-bold uppercase">
          <i className="fr-icon-map-pin-2-line" aria-hidden="true" />
          {t("LearnFrench.filters_location", "Localisation")}
        </h3>
        <LocationFilter
          departments={filters.departments}
          cities={filters.cities}
          onChange={(departments, cities) => props.onChange({ ...filters, departments, cities })}
        />
      </div>

      <div>
        <h3 className="text-label-grey mb-3 flex items-center gap-2 text-sm font-bold uppercase">
          <i className="fr-icon-chat-3-line" aria-hidden="true" />
          {t("LearnFrench.filters_level", "Niveau visé")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {frenchLevelFilter.map((option) => (
            <FilterButton
              key={option.key}
              active={filters.frenchLevel.includes(option.key)}
              onClick={() =>
                props.onChange({ ...filters, frenchLevel: toggle(filters.frenchLevel, option.key) })
              }
            >
              {t(option.value, "")}
            </FilterButton>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-label-grey mb-3 flex items-center gap-2 text-sm font-bold uppercase">
          <i className="fr-icon-layout-grid-line" aria-hidden="true" />
          {t("LearnFrench.filters_category", "Catégorie")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {props.categoryOptions.map((need) => (
            <FilterButton
              key={String(need._id)}
              active={filters.categories.includes(need._id)}
              onClick={() =>
                props.onChange({ ...filters, categories: toggle(filters.categories, need._id) })
              }
            >
              {need[locale]?.text || need.fr.text}
            </FilterButton>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-label-grey mb-3 flex items-center gap-2 text-sm font-bold uppercase">
          <i className="fr-icon-user-line" aria-hidden="true" />
          {t("LearnFrench.filters_public", "Public visé")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {publicOptions.map((option) => (
            <FilterButton
              key={option.key}
              active={filters.publicFilter.includes(option.key)}
              onClick={() =>
                props.onChange({
                  ...filters,
                  publicFilter: toggle(filters.publicFilter, option.key),
                })
              }
            >
              {t(option.value, "")}
            </FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
};
