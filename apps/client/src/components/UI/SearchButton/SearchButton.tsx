import { cls } from "@/lib/classname";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
    <div className={styles.container}>
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

export default SearchButton;
