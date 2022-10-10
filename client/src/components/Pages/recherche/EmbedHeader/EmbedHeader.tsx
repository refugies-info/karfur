import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Theme } from "types/interface";
import { getThemeName } from "lib/getThemeName";
import useRTL from "hooks/useRTL";
import ThemeIcon from "components/UI/ThemeIcon";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import styles from "./EmbedHeader.module.scss";

interface Props {
  themes: Theme[];
  departments: string[];
  languages: string[];
}

const EmbedHeader = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isRTL = useRTL();
  const languages = useSelector(allLanguesSelector);

  const selectedTheme = props.themes.length === 1 ? props.themes[0] : null;
  const selectedDepartment = props.departments.length === 1 ? props.departments[0] : null;
  const selectedLanguage =
    props.languages.length === 1 ? languages.find((ln) => ln.i18nCode === props.languages[0]) : null;

  return (
    <p className={styles.text}>
      {(selectedTheme || selectedDepartment || selectedLanguage) && `${t("Widget.fiches", "Fiches")} `}
      {selectedTheme && (
        <>
          {t("Widget.withTheme", "avec le thème")}{" "}
          <span className={styles.btn} style={{ backgroundColor: selectedTheme.colors.color100 }}>
            <span className={styles.theme_icon}>
              <ThemeIcon theme={selectedTheme} size={18} />
            </span>
            <span className="ml-2">{getThemeName(selectedTheme, router.locale, "short")}</span>
          </span>
        </>
      )}
      {(selectedLanguage || selectedDepartment) && ` ${t("Widget.available", "disponibles")} `}
      {selectedDepartment && (
        <>
          {t("Widget.inLocation", "en")} <span className={styles.btn}>{selectedDepartment}</span>
        </>
      )}
      {selectedLanguage && (
        <>
          {" "}{t("Widget.inLanguage", "en")}{" "}
          <span className={styles.btn}>
            <i
              className={"flag-icon flag-icon-" + selectedLanguage.langueCode}
              title={selectedLanguage.langueCode}
              id={selectedLanguage.langueCode}
            />
            <span className={"language-name " + (isRTL ? "mr-2" : "ml-2")}>{selectedLanguage.langueFr}</span>
          </span>
        </>
      )}
    </p>
  );
};

export default EmbedHeader;
