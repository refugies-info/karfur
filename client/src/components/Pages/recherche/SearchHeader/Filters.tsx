import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import LocationMenu from "../LocationMenu";
import ThemeMenu from "../ThemeMenu";
import Filter from "./Filter";
import styles from "./Filters.module.scss";
import { useAgeOptions, useFrenchLevelOptions, useLanguagesOptions, usePublicOptions, useStatusOptions } from "./hooks";
import SearchInput from "./SearchInput";

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
      <SearchInput onChange={onChangeSearchInput} />
      <div className="d-flex align-items-center gap-3">
        <Filter
          label={t("Dispositif.Département", "Département")}
          dropdownMenu={{
            value: query.departments,
            reset: resetDepartment,
            menu: <LocationMenu />,
          }}
          gaType="department"
        />
        <Filter
          label={t("Recherche.themes", "Thèmes")}
          dropdownMenu={{
            value: themeDisplayedValue,
            reset: resetTheme,
            menu: <ThemeMenu mobile={false} isOpen={true} /> /* TODO: fix isOpen here */,
          }}
          gaType="themes"
        />
        <Filter
          label={t("Recherche.filterStatus", "Statut")}
          dropdownMenu={{
            filterKey: "status",
            selected: query.status,
            options: statusOptions,
            translateOptions: true,
            menuItemStyles: cls(styles.menuItem, styles.small),
          }}
          gaType="age"
        />
        <Filter
          label={t("Recherche.filterPublic", "Public visé")}
          dropdownMenu={{
            filterKey: "public",
            selected: query.public,
            options: publicOptions,
            translateOptions: true,
            menuItemStyles: cls(styles.menuItem, styles.small),
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
            menuItemStyles: cls(styles.menuItem, styles.small),
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
            menuItemStyles: cls(styles.menuItem, styles.small),
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
            menuItemStyles: cls(styles.menuItem, styles.medium),
          }}
          gaType="language"
        />
      </div>
    </Container>
  );
};

export default Filters;
