import React from "react";
import styles from "./EmbedHeader.module.scss";
import { Theme } from "types/interface";
import ThemeIcon from "components/UI/ThemeIcon";
import { getThemeName } from "lib/getThemeName";
import { useRouter } from "next/router";
import useRTL from "hooks/useRTL";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";

interface Props {
  themes: Theme[];
  departments: string[];
  languages: string[];
}
/* TODO : trad */
const EmbedHeader = (props: Props) => {
  const router = useRouter();
  const isRTL = useRTL();
  const languages = useSelector(allLanguesSelector);

  const selectedTheme = props.themes.length === 1 ? props.themes[0] : null;
  const selectedDepartment = props.departments.length === 1 ? props.departments[0] : null;
  const selectedLanguage =
    props.languages.length === 1 ? languages.find((ln) => ln.i18nCode === props.languages[0]) : null;

  return (
    <p className={styles.text}>
      {selectedTheme && selectedDepartment && selectedLanguage && "Fiches "}
      {selectedTheme && (
        <>
          avec le thème{" "}
          <span className={styles.btn} style={{ backgroundColor: selectedTheme.colors.color100 }}>
            <span className={styles.theme_icon}>
              <ThemeIcon theme={selectedTheme} size={18} />
            </span>
            <span className="ml-2">{getThemeName(selectedTheme, router.locale, "short")}</span>
          </span>
        </>
      )}
      {(selectedLanguage || selectedDepartment) && " disponibles "}
      {selectedDepartment && (
        <>
          en <span className={styles.btn}>{selectedDepartment}</span>
        </>
      )}
      {selectedLanguage && (
        <>
          {" en "}
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
