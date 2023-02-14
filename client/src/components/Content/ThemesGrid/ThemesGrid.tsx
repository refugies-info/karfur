import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { sortThemes } from "lib/sortThemes";
import { themesSelector } from "services/Themes/themes.selectors";
import SearchThemeButton from "components/UI/SearchThemeButton";
import styles from "./ThemesGrid.module.scss";
import { Id } from "api-types";

interface Props {
  className?: string;
  onClickTheme: (themeId: Id) => void;
}

const ThemesGrid = (props: Props) => {
  const { t } = useTranslation();
  const themes = useSelector(themesSelector);

  return (
    <Container className={props.className}>
      <h2 className="h3">{t("Recherche.titleThemes", "Les thématiques de l'intégration")}</h2>
      <div className={styles.themes}>
        {themes.sort(sortThemes).map((theme, i) => {
          return <SearchThemeButton key={i} theme={theme} onClick={() => props.onClickTheme(theme._id)} />;
        })}
      </div>
    </Container>
  );
};

export default ThemesGrid;
