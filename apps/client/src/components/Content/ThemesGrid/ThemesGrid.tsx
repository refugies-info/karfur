import { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import SearchThemeButton from "~/components/UI/SearchThemeButton";
import { sortThemes } from "~/lib/sortThemes";
import { themesSelector } from "~/services/Themes/themes.selectors";
import styles from "./ThemesGrid.module.scss";

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
