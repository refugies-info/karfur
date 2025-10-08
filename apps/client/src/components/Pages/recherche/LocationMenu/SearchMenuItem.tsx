import { useTranslation } from "next-i18next";
import React, { useEffect, useRef } from "react";
import { cls } from "~/lib/classname";
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
    <form className={styles.item} onClick={(e) => e.preventDefault()} onSubmit={(e) => e.preventDefault()}>
      <span className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <label htmlFor="location-search" className="sr-only">
          {t("Rechercher", "Rechercher")}
        </label>
        <input
          type="text"
          ref={ref}
          dir={i18n.dir()}
          className={styles.input}
          id="location-search"
          placeholder={t("Rechercher", "Rechercher")}
          name="location-search"
          onChange={onChange}
        />
      </span>
    </form>
  );
};

export default SearchMenuItem;
