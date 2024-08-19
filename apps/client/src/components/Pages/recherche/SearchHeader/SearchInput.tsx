import { cls } from "lib/classname";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import styles from "./SearchInput.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchInput: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();
  const query = useSelector(searchQuerySelector);

  return (
    <div className={styles.container}>
      <div className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <input
          className={styles.input}
          type="text"
          placeholder={t("Recherche.keyword", "Mot-clé")}
          onChange={onChange}
          value={query.search}
        />
      </div>
      <div className={styles.border}>&nbsp;</div>
    </div>
  );
};

export default SearchInput;
