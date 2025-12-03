import { useTranslation } from "next-i18next";
import type React from "react";
import { useEffect, useRef } from "react";
import { cls } from "~/lib/classname";
import styles from "./SearchButton.module.css";

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchButton: React.FC<Props> = ({ onChange }) => {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <form className={styles.container} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.zone}>
        <i className={cls("fr-icon-search-line", styles.icon)} />
        <label htmlFor="theme-search-button" className="sr-only">
          {t("Recherche.themesPlaceholder", "Rechercher dans les thèmes")}
        </label>
        <input
          type="text"
          ref={ref}
          // dir={i18n.dir()}
          className={styles.input}
          placeholder={t("Recherche.themesPlaceholder", "Rechercher dans les thèmes")}
          onChange={onChange}
          id="theme-search-button"
          name="theme-search-button"
        />
      </div>
    </form>
  );
};

export default SearchButton;
