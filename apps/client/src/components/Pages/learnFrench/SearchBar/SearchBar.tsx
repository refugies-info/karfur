import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslation } from "next-i18next";
import { LocationFilterButton } from "~/components/Pages/learnFrench/LocationFilter";

interface Props {
  departments: string[];
  cities: string[];
  onLocationsChange: (departments: string[], cities: string[]) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const SearchBar = (props: Props) => {
  const { t } = useTranslation();
  const placeholder = t("LearnFrench.search_placeholder");

  return (
    <div className="container flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h5 mb-0">{t("LearnFrench.search_title")}</h2>
        <LocationFilterButton
          departments={props.departments}
          cities={props.cities}
          onChange={props.onLocationsChange}
        />
      </div>
      <Input
        iconId="fr-icon-search-line"
        label={placeholder}
        className="mb-0 w-full [&_label]:sr-only lg:w-80"
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
