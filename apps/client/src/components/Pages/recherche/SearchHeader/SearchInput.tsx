import Input from "@codegouvfr/react-dsfr/Input";
import { useTranslation } from "next-i18next";
import React from "react";
import { useSelector } from "react-redux";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cn } from "~/lib/classname";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./SearchInput.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

const SearchInput: React.FC<Props> = ({ onChange, className }) => {
  const { t } = useTranslation();
  const query = useSelector(searchQuerySelector);

  const stylesDisabled = useStylesDisabled();

  const hintText = stylesDisabled ? t("Recherche.keyword", "Rechercher par mot-clé") : "";

  return (
    <>
      <Input
        iconId="fr-icon-search-line"
        className={cn(styles.container, "[&_label]:sr-only", className)}
        label={t("Recherche.keyword", "Rechercher par mot-clé")}
        hintText={hintText}
        nativeInputProps={{
          placeholder: t("Recherche.keyword", "Rechercher par mot-clé"),
          onChange,
          value: query.search,
          className: "fr-input-wrap fr-icon-search-line",
        }}
      />
      {stylesDisabled && <br />}
    </>
  );
};

export default SearchInput;
