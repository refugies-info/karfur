import type { GetNeedResponse, Id } from "@refugies-info/api-types";
import type { FrenchOptions, PublicOptions } from "data/searchFilters";
import { frenchLevelFilter, publicOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import { LocationFilter } from "~/components/Pages/learnFrench/LocationFilter";
import useLocale from "~/hooks/useLocale";
import { getFrenchLevelOptionLabel } from "~/lib/learnFrench/frenchLevelLabels";
import { FilterPill } from "./FilterPill";

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
  showHeader?: boolean;
  compactLevelLabels?: boolean;
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const SECTION_TITLE_CLASSNAME =
  "text-default-grey mb-3 flex items-center gap-2 text-chapo font-bold";

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
      {props.showHeader !== false && (
        <div className="flex items-center">
          <h2 className="text-title-grey text-h5 mb-0 font-bold">
            {t("LearnFrench.filters_title", "Filtrer")}
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              className="text-title-blue-france ml-auto text-sm underline"
              onClick={props.onReset}
            >
              {t("LearnFrench.filters_reset", "Effacer")}
            </button>
          )}
        </div>
      )}

      <div>
        <h3 className={SECTION_TITLE_CLASSNAME}>
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
        <h3 className={SECTION_TITLE_CLASSNAME}>
          <i className="fr-icon-chat-3-line" aria-hidden="true" />
          {t("LearnFrench.filters_level", "Niveau actuel")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {frenchLevelFilter.map((option) => (
            <FilterPill
              key={option.key}
              active={filters.frenchLevel.includes(option.key)}
              onClick={() =>
                props.onChange({ ...filters, frenchLevel: toggle(filters.frenchLevel, option.key) })
              }
            >
              {props.compactLevelLabels
                ? getFrenchLevelOptionLabel(option.key, t)
                : t(option.value, option.value)}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h3 className={SECTION_TITLE_CLASSNAME}>
          <i className="fr-icon-layout-grid-line" aria-hidden="true" />
          {t("LearnFrench.filters_category", "Catégorie")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {props.categoryOptions.map((need) => (
            <FilterPill
              key={String(need._id)}
              active={filters.categories.includes(need._id)}
              onClick={() =>
                props.onChange({ ...filters, categories: toggle(filters.categories, need._id) })
              }
            >
              {need[locale]?.text || need.fr.text}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h3 className={SECTION_TITLE_CLASSNAME}>
          <i className="ri-account-circle-line" aria-hidden="true" />
          {t("LearnFrench.filters_public", "Public visé")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {publicOptions.map((option) => (
            <FilterPill
              key={option.key}
              active={filters.publicFilter.includes(option.key)}
              onClick={() =>
                props.onChange({
                  ...filters,
                  publicFilter: toggle(filters.publicFilter, option.key),
                })
              }
            >
              {t(option.value, option.value)}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
};
