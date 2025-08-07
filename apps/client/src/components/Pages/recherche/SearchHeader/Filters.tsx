import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { DropdownProvider } from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { useSearchEventName, useWindowSize } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { getDepartmentsNotDeployed } from "~/lib/recherche/functions";
import { Event } from "~/lib/tracking";
import { CountItem } from "~/pages/api/search/counts";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector, themesDisplayedValueSelector } from "~/services/SearchResults/searchResults.selector";
import LocationMenu from "../LocationMenu";
import { useSearchCounts } from "../SearchCountsContext";
import ThemeMenu from "../ThemeMenu";
import Filter from "./Filter";
import styles from "./Filters.module.scss";
import { useAgeOptions, useFrenchLevelOptions, useLanguagesOptions, usePublicOptions, useStatusOptions } from "./hooks";
import SearchInput from "./SearchInput";

type Props = {
  isSticky?: boolean;
};

const Filters: React.FC<Props> = ({ isSticky }) => {
  const counts = useSearchCounts();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const stylesDisabled = useStylesDisabled();

  const eventName = useSearchEventName();

  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>(
    getDepartmentsNotDeployed(query.departments, dispositifs),
  );

  useEffect(() => {
    setDepartmentsNotDeployed(getDepartmentsNotDeployed(query.departments, dispositifs));
  }, [query.departments, dispositifs]);

  // KEYWORD
  const onChangeSearchInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event(eventName, "use keyword filter", "use searchbar");
    },
    [dispatch, eventName],
  );

  // THEME
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const resetTheme = useCallback(() => {
    dispatch(addToQueryActionCreator({ needs: [], themes: [] }));
  }, [dispatch]);

  const themeLabel = useMemo(() => {
    return themeDisplayedValue.length > 0 ? themeDisplayedValue[0] : t("Recherche.theme", "Thème");
  }, [t, themeDisplayedValue]);

  // LOCATION
  const resetDepartment = useCallback(() => {
    dispatch(addToQueryActionCreator({ departments: [], sort: "default" }));
  }, [dispatch]);

  const { isTablet } = useWindowSize();

  const locationLabel = useMemo(() => {
    return query.departments.length === 0
      ? t("Recherche.filterLocation", "Département")
      : departmentsNotDeployed.length > 0 && isTablet
        ? `${query.departments[0]} ⚠️`
        : query.departments[0];
  }, [t, query.departments, departmentsNotDeployed, isTablet]);

  const statusOptions = useStatusOptions();
  const publicOptions = usePublicOptions();
  const ageOptions = useAgeOptions();
  const frenchLevelOptions = useFrenchLevelOptions();
  const languageOptions = useLanguagesOptions();

  const countsByFilter = useMemo(() => {
    if (!counts) return {};
    return {
      status: Object.fromEntries((counts.statuses || []).map((c: CountItem) => [c.id, c.count])),
      public: Object.fromEntries((counts.publics || []).map((c: CountItem) => [c.id, c.count])),
      age: Object.fromEntries((counts.ageRanges || []).map((c: CountItem) => [c.id, c.count])),
      frenchLevel: Object.fromEntries((counts.frenchLevels || []).map((c: CountItem) => [c.id, c.count])),
      language: Object.fromEntries((counts.languages || []).map((c: CountItem) => [c.id, c.count])),
    };
  }, [counts]);

  return (
    <Container className={cls(styles.container, isSticky && styles.sticky)}>
      <SearchInput className={styles.searchZone} onChange={onChangeSearchInput} />
      <DropdownProvider>
        <div className={styles.filtersBar}>
          <Filter
            tooltip={
              departmentsNotDeployed.length > 0
                ? {
                    trigger: "⚠️",
                    text: t("Recherche.notDeployedText", { department: departmentsNotDeployed.join(", ") }),
                  }
                : null
            }
            label={locationLabel}
            externalMenu={{
              value: query.departments,
              reset: resetDepartment,
              menu: <LocationMenu counts={counts?.departments} />,
            }}
            gaType="department"
          />
          <Filter
            label={themeLabel}
            externalMenu={{
              value: themeDisplayedValue,
              reset: resetTheme,
              menu: <ThemeMenu mobile={false} isOpen={true} counts={counts} /> /* TODO: fix isOpen here */,
            }}
            gaType="themes"
            autoFocus={false}
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
                counts: countsByFilter.status,
              },
            ]}
            className={cls(styles.filter, styles.filterHiddenOnMobile)}
            gaType="status"
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
                counts: countsByFilter.public,
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
                counts: countsByFilter.age,
              },
            ]}
            className={cls(styles.filter, styles.filterHiddenOnMobile)}
            gaType="age"
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
                counts: countsByFilter.frenchLevel,
              },
            ]}
            className={cls(styles.filter, styles.filterHiddenOnMobile)}
            gaType="frenchLevel"
          />
          <Filter
            label={t("Recherche.filterLanguage", "Traduit en")}
            menuItems={[
              {
                filterKey: "language",
                selected: query.language,
                options: languageOptions,
                translateOptions: false,
                menuItemStyles: cls(styles.menuItem, styles.medium),
                counts: countsByFilter.language,
              },
            ]}
            className={cls(styles.filter, styles.filterHiddenOnMobile)}
            gaType="language"
          />

          {!stylesDisabled && (
            <Filter
              label={t("Recherche.filtersAndSortModalTitle", "Filtres et tri")}
              icon="ri-equalizer-line"
              showFilterCount={true}
              menuItems={[
                {
                  label: t("Recherche.filterStatus", "Statut"),
                  filterKey: "status",
                  selected: query.status,
                  options: statusOptions,
                  translateOptions: true,
                  menuItemStyles: cls(styles.menuItem, styles.small),
                  gaType: "status",
                },
                {
                  label: t("Recherche.filterPublic", "Public visé"),
                  filterKey: "public",
                  selected: query.public,
                  options: publicOptions,
                  translateOptions: true,
                  menuItemStyles: cls(styles.menuItem, styles.small),
                  gaType: "public",
                },
                {
                  label: t("Recherche.filterAge", "Tranche d'âge"),
                  filterKey: "age",
                  selected: query.age,
                  options: ageOptions,
                  translateOptions: true,
                  menuItemStyles: cls(styles.menuItem, styles.small),
                  gaType: "age",
                },
                {
                  label: t("Recherche.filterFrenchLevel", "Niveau de français"),
                  filterKey: "frenchLevel",
                  selected: query.frenchLevel,
                  options: frenchLevelOptions,
                  translateOptions: true,
                  menuItemStyles: cls(styles.menuItem, styles.small),
                  gaType: "frenchLevel",
                },
                {
                  label: t("Recherche.filterLanguage", "Fiches traduites en"),
                  filterKey: "language",
                  selected: query.language,
                  options: languageOptions,
                  translateOptions: false,
                  menuItemStyles: cls(styles.menuItem, styles.medium),
                  gaType: "language",
                },
              ]}
              className={cls(styles.collapsedFiltersButton)}
              gaType="mobile"
            />
          )}
        </div>
      </DropdownProvider>
    </Container>
  );
};

export default Filters;
