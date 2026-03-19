import Input from "@codegouvfr/react-dsfr/Input";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./SearchInput.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
}

const SearchInput: React.FC<Props> = ({ onChange, onFocus, onBlur, className }) => {
  const { t } = useTranslation();
  const query = useSelector(searchQuerySelector);
  const inputRef = useRef<HTMLInputElement>(null);

  const stylesDisabled = useStylesDisabled();

  const hintText = stylesDisabled ? t("Recherche.keyword", "Rechercher par mot-clé") : "";

  useEffect(() => {
    if (inputRef.current) {
      const computed = window.getComputedStyle(inputRef.current);
      console.log("[SearchInput DEBUG] computed styles:", {
        height: computed.height,
        lineHeight: computed.lineHeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        padding: computed.padding,
        margin: computed.margin,
        display: computed.display,
        overflow: computed.overflow,
      });
    }
  }, []);

  return (
    <>
      <Input
        ref={inputRef}
        iconId="fr-icon-search-line"
        className={cn(styles.container, "[&_label]:sr-only", className)}
        label={t("Recherche.keyword", "Rechercher par mot-clé")}
        hintText={hintText}
        nativeInputProps={{
          type: "search",
          placeholder: t("Recherche.keyword", "Rechercher par mot-clé"),
          onChange,
          onFocus,
          onBlur,
          value: query.search,
          className: "fr-input-wrap fr-icon-search-line",
        }}
      />
      {stylesDisabled && <br />}
    </>
  );
};

export default SearchInput;
