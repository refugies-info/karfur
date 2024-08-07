import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cls } from "lib/classname";
import { useTranslation } from "next-i18next";
import React, { useEffect, useRef } from "react";
import utilityStyles from "~css/utilities.module.css";
import styles from "./SearchMenuItem.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchMenuItem: React.FC<Props> = ({ onChange }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <div
      className={cls(styles.item, utilityStyles.noSelect)}
      onClick={(e) => e.preventDefault()}
    >
      <div className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <input
          type="text"
          ref={ref}
          dir={i18n.dir()}
          className={styles.input}
          placeholder={t("Rechercher", "Rechercher")}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchMenuItem;
