import Input from "@codegouvfr/react-dsfr/Input";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import type { FiltersState } from "~/components/Pages/learnFrench/FiltersSidebar";
import { LocationFilterButton } from "~/components/Pages/learnFrench/LocationFilter";
import styles from "./SearchBar.module.css";

interface Props {
  filters: FiltersState;
  onLocationsChange: (departments: string[], cities: string[]) => void;
  onReset: () => void;
  onOpenLocationPanel: () => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const SearchBar = (props: Props) => {
  const { t } = useTranslation();
  const placeholder = t("LearnFrench.search_placeholder");
  const { filters } = props;
  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.cities.length > 0 ||
    filters.frenchLevel.length > 0 ||
    filters.categories.length > 0 ||
    filters.publicFilter.length > 0;

  return (
    <div className="container flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h2 mb-0 font-bold">{t("LearnFrench.search_title")}</h2>
        <LocationFilterButton
          departments={filters.departments}
          cities={filters.cities}
          onChange={props.onLocationsChange}
          onOpenPanel={props.onOpenLocationPanel}
        />
        {hasActiveFilters && (
          <button
            type="button"
            className="text-title-blue-france hidden text-sm underline lg:inline"
            onClick={props.onReset}
          >
            {t("LearnFrench.filters_reset", "Effacer")}
          </button>
        )}
      </div>
      <Input
        iconId="fr-icon-search-line"
        label={placeholder}
        className={cn(
          styles.searchInput,
          "[&_.fr-input]:!bg-white mb-0 hidden w-full [&_label]:sr-only lg:block lg:w-80",
        )}
        nativeInputProps={{
          type: "search",
          placeholder,
          value: props.search,
          onChange: (e) => props.onSearchChange(e.target.value),
        }}
      />
    </div>
  );
};
