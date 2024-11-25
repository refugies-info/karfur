import Input from "@codegouvfr/react-dsfr/Input";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./SearchInput.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

const SearchInput: React.FC<Props> = ({ onChange, className }) => {
  const { t } = useTranslation();
  const query = useSelector(searchQuerySelector);

  const styleDisabled = useStylesDisabled();

  const hintText = styleDisabled ? t("Recherche.keyword", "Rechercher par mot-clé") : "";

  return (
    <Input
      iconId="fr-icon-search-line"
      className={cls(styles.container, className)}
      label=""
      hintText={hintText}
      nativeInputProps={{
        placeholder: t("Recherche.keyword", "Rechercher par mot-clé"),
        onChange,
        value: query.search,
        className: "fr-input-wrap fr-icon-search-line",
      }}
    />
  );
};

export default SearchInput;
