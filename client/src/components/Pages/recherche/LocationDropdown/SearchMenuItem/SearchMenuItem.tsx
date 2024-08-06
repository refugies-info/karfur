import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cls } from "lib/classname";
import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./SearchMenuItem.module.css";

const SearchMenuItem: React.FC = () => {
  const { t } = useTranslation();
  return (
    <DropdownMenu.DropdownMenuItem className={styles.container} onClick={(e) => e.preventDefault()}>
      <div className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <input type="text" className={styles.input} placeholder={t("Rechercher", "Rechercher")} />
      </div>
    </DropdownMenu.DropdownMenuItem>
  );
};

export default SearchMenuItem;
