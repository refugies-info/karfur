import Input from "@codegouvfr/react-dsfr/Input";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useTranslation } from "next-i18next";
import { summarizeLocations } from "~/lib/learnFrench/summarizeLocations";

interface Props {
  locations: string[];
  onClearLocations: () => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const SearchBar = (props: Props) => {
  const { t } = useTranslation();
  const placeholder = t("LearnFrench.search_placeholder");

  return (
    <div className="container flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-h5 mb-0">{t("LearnFrench.search_title")}</h2>
        {props.locations.length > 0 && (
          <Tag dismissible onClick={props.onClearLocations}>
            {summarizeLocations(props.locations)}
          </Tag>
        )}
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
