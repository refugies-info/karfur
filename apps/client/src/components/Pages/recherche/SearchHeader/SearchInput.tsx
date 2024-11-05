import Input from "@codegouvfr/react-dsfr/Input";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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

  return (
    <Input
      iconId="fr-icon-search-line"
      className={cls(styles.container, className)}
      label="Url du site :"
      hintText="Saisissez une url valide, commençant par https://"
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
