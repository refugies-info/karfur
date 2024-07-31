import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import LocationDropdown from "../LocationDropdown";
import ThemeDropdown from "../ThemeDropdown";
import Filter from "./Filter";
import styles from "./Filters.module.scss";
import { useAgeOptions, useFrenchLevelOptions, useLanguagesOptions, usePublicOptions, useStatusOptions } from "./hooks";

interface Props {
  isSmall?: boolean;
}

const Filters = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

  // KEYWORD
  const onChangeSearchInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event("USE_SEARCH", "use keyword filter", "use searchbar");
    },
    [dispatch],
  );

  // THEME
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const resetTheme = useCallback(() => {
    addToQueryActionCreator({ needs: [], themes: [] });
  }, []);

  // LOCATION
  const resetDepartment = useCallback(() => {
    addToQueryActionCreator({ departments: [], sort: "date" });
  }, []);

  const statusOptions = useStatusOptions();
  const publicOptions = usePublicOptions();
  const ageOptions = useAgeOptions();
  const frenchLevelOptions = useFrenchLevelOptions();
  const languageOptions = useLanguagesOptions();

  return (
    <Container className={cls(styles.container, props.isSmall && styles.small)}>
      <div className={styles.search}>
        <i className="fr-icon-search-line" />
        <input
          type="text"
          className="fr-input"
          placeholder={t("Recherche.keyword", "Mot-clé")}
          onChange={onChangeSearchInput}
          value={query.search}
        />
      </div>
      <div className="d-flex align-items-center gap-3">
        <Filter
          label={t("Dispositif.Département", "Département")}
          dropdownMenu={{
            value: query.departments,
            reset: resetDepartment,
            menu: <LocationDropdown />,
          }}
          gaType="department"
        />
        <Filter
          label={t("Recherche.themes", "Thèmes")}
          dropdownMenu={{
            value: themeDisplayedValue,
            reset: resetTheme,
            menu: <ThemeDropdown mobile={false} isOpen={true} /> /* TODO: fix isOpen here */,
          }}
          gaType="themes"
        />
        <Filter
          label={"Statut"}
          dropdownMenu={{
            filterKey: "status",
            selected: query.status,
            options: statusOptions,
            translateOptions: true,
            width: "272px",
          }}
          gaType="age"
        />
        <Filter
          label={"Public visé"}
          dropdownMenu={{
            filterKey: "public",
            selected: query.public,
            options: publicOptions,
            translateOptions: true,
            width: "272px",
          }}
          gaType="public"
        />
        <Filter
          label={t("Recherche.filterAge", "Tranche d'âge")}
          dropdownMenu={{
            filterKey: "age",
            selected: query.age,
            options: ageOptions,
            translateOptions: true,
            width: "272px",
          }}
          gaType="status"
        />
        <Filter
          label={t("Recherche.filterFrenchLevel", "Niveau de français")}
          dropdownMenu={{
            filterKey: "frenchLevel",
            selected: query.frenchLevel,
            options: frenchLevelOptions,
            translateOptions: true,
            width: "272px",
          }}
          gaType="frenchLevel"
        />
        <Filter
          label={t("Recherche.filterLanguage", "Fiches traduites en")}
          dropdownMenu={{
            filterKey: "language",
            selected: query.language,
            options: languageOptions,
            translateOptions: false,
            width: "288px",
          }}
          gaType="language"
        />
      </div>
    </Container>
  );
};

export default Filters;
