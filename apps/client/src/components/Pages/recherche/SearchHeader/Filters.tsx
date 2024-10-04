import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector, themesDisplayedValueSelector } from "~/services/SearchResults/searchResults.selector";
import LocationMenu from "../LocationMenu";
import ThemeMenu from "../ThemeMenu";
import Filter from "./Filter";
import styles from "./Filters.module.scss";
import { useAgeOptions, useFrenchLevelOptions, useLanguagesOptions, usePublicOptions, useStatusOptions } from "./hooks";
import SearchInput from "./SearchInput";
const Filters = () => {
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
    dispatch(addToQueryActionCreator({ needs: [], themes: [] }));
  }, [dispatch]);

  // LOCATION
  const resetDepartment = useCallback(() => {
    dispatch(addToQueryActionCreator({ departments: [], sort: "default" }));
  }, [dispatch]);

  const statusOptions = useStatusOptions();
  const publicOptions = usePublicOptions();
  const ageOptions = useAgeOptions();
  const frenchLevelOptions = useFrenchLevelOptions();
  const languageOptions = useLanguagesOptions();

  return (
    <Container className={cls(styles.container)}>
      <SearchInput className={styles.searchZone} onChange={onChangeSearchInput} />
      <div className={styles.filtersBar}>
        <Filter
          label={t("Dispositif.Département", "Département")}
          layout={"mobile"}
          externalMenu={{
            value: query.departments,
            reset: resetDepartment,
            menu: <LocationMenu />,
          }}
          gaType="department"
        />
        <Filter
          label={t("Recherche.themes", "Thèmes")}
          externalMenu={{
            value: themeDisplayedValue,
            reset: resetTheme,
            menu: <ThemeMenu mobile={false} isOpen={true} /> /* TODO: fix isOpen here */,
          }}
          gaType="themes"
        />
        <Filter
          label={t("Recherche.filterStatus", "Statut")}
          menuItems={[
            {
              filterKey: "status",
              selected: query.status,
              options: statusOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
          ]}
          className={cls(styles.filter, styles.filterHiddenOnMobile)}
          gaType="age"
        />
        <Filter
          label={t("Recherche.filterPublic", "Public visé")}
          menuItems={[
            {
              filterKey: "public",
              selected: query.public,
              options: publicOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
          ]}
          className={cls(styles.filter, styles.filterHiddenOnMobile)}
          gaType="public"
        />
        <Filter
          label={t("Recherche.filterAge", "Tranche d'âge")}
          menuItems={[
            {
              filterKey: "age",
              selected: query.age,
              options: ageOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
          ]}
          className={cls(styles.filter, styles.filterHiddenOnMobile)}
          gaType="status"
        />
        <Filter
          label={t("Recherche.filterFrenchLevel", "Niveau de français")}
          menuItems={[
            {
              filterKey: "frenchLevel",
              selected: query.frenchLevel,
              options: frenchLevelOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
          ]}
          className={cls(styles.filter, styles.filterHiddenOnMobile)}
          gaType="frenchLevel"
        />
        <Filter
          label={t("Recherche.filterLanguage", "Fiches traduites en")}
          menuItems={[
            {
              filterKey: "language",
              selected: query.language,
              options: languageOptions,
              translateOptions: false,
              menuItemStyles: cls(styles.menuItem, styles.medium),
            },
          ]}
          className={cls(styles.filter, styles.filterHiddenOnMobile)}
          gaType="language"
        />

        <Filter
          label={t("Recherche.filtersAndSortModalTitle", "Filtres et tri")}
          icon="ri-equalizer-line"
          menuItems={[
            {
              label: t("Recherche.filterStatus", "Statut"),
              filterKey: "status",
              selected: query.status,
              options: statusOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
            {
              label: t("Recherche.filterPublic", "Public visé"),
              filterKey: "public",
              selected: query.public,
              options: publicOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
            {
              label: t("Recherche.filterAge", "Tranche d'âge"),
              filterKey: "age",
              selected: query.age,
              options: ageOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
            {
              label: t("Recherche.filterFrenchLevel", "Niveau de français"),
              filterKey: "frenchLevel",
              selected: query.frenchLevel,
              options: frenchLevelOptions,
              translateOptions: true,
              menuItemStyles: cls(styles.menuItem, styles.small),
            },
            {
              label: t("Recherche.filterLanguage", "Fiches traduites en"),
              filterKey: "language",
              selected: query.language,
              options: languageOptions,
              translateOptions: false,
              menuItemStyles: cls(styles.menuItem, styles.medium),
            },
          ]}
          className={cls(styles.collapsedFiltersButton)}
          gaType="language"
        />
      </div>
    </Container>
  );
};

export default Filters;
