import { cls } from "lib/classname";
import React from "react";
import styles from "./SearchButton.module.css";

const SearchButton: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <input type="text" className={styles.input} placeholder="Rechercher" />
      </div>
    </div>
  );
};

export default SearchButton;
