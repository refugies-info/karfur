import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { DropdownProvider } from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { useSearchEventName } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { decodeHTMLEntities } from "~/lib/decodeHTMLEntities";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import {
  searchPaginationSelector,
  searchQuerySelector,
  searchResultsSelector,
  themesDisplayedValueSelector,
} from "~/services/SearchResults/searchResults.selector";
import LocationMenu from "../LocationMenu";
import { useSearchCounts } from "../SearchCountsContext";
import ThemeMenu from "../ThemeMenu";
import Filter from "./Filter";
import styles from "./Filters.module.scss";
import {
  useAgeOptions,
  useFrenchLevelOptions,
  useLanguagesOptions,
  usePublicOptions,
  useStatusOptions,
} from "./hooks";
import SearchInput from "./SearchInput";

interface Props {
  isSticky: boolean;
}

const Filters = (props: Props) => {
  const { isSticky } = props;
  const counts = useSearchCounts();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const searchResults = useSelector(searchResultsSelector);
  const pagination = useSelector(searchPaginationSelector);
  const stylesDisabled = useStylesDisabled();
  const announce = useAnnounce();
  const eventName = useSearchEventName();

  const NOT_DEPLOYED_THRESHOLD = 10;
  const departmentsNotDeployed = useMemo(() => {
    if (query.departments.length === 0) return [];
    if (pagination.total >= NOT_DEPLOYED_THRESHOLD) return [];
    return query.departments;
  }, [query.departments, pagination.total]);

  // KEYWORD
  const [insideSearchInput, setInsideSearchInput] = useState(false);
  const [currentSearchInputValue, setCurrentSearchInputValue] = useState("");
  const onChangeSearchInput = useCallback(
    (e: any) => {
      setCurrentSearchInputValue(e.target.value);
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event(eventName, "use keyword filter", "use searchbar");
    },
    [dispatch, eventName],
  );

  const onFocusSearchInput = useCallback(() => {
    setInsideSearchInput(true);
  }, []);

  const onBlurSearchInput = useCallback(() => {
    setInsideSearchInput(false);
  }, []);

  useEffect(() => {
    if (!insideSearchInput) return;

    if (currentSearchInputValue.length === 0) {
      announce(
        t("Recherche.emptySearch", "Recherche par mot clé vide. {{count}} fiches chargées", {
          count: searchResults.matches.length,
          search: currentSearchInputValue,
        }),
        {
          priority: "interrupt",
          delay: 100,
        },
      );
      return;
    }

    announce(
      t(
        "Recherche.resultsForYourSearch",
        "{{count}} résultats trouvés pour votre recherche {{search}}",
        {
          count: searchResults.matches.length,
          search: currentSearchInputValue,
        },
      ),
      {
        priority: "interrupt",
        delay: 1000,
      },
    );
  }, [announce, searchResults.matches.length, t, currentSearchInputValue, insideSearchInput]);

  // THEME
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const resetTheme = useCallback(() => {
    dispatch(addToQueryActionCreator({ needs: [], themes: [] }));
  }, [dispatch]);

  const themeLabel = useMemo(() => {
    return themeDisplayedValue.length > 0 ? themeDisplayedValue[0] : t("Recherche.theme", "Thème");
  }, [t, themeDisplayedValue]);

  // LOCATION
  const resetLocation = useCallback(() => {
    dispatch(addToQueryActionCreator({ departments: [], cities: [], sort: "default" }));
    announce(t("Recherche.departmentsCleared", "Filtre de localisation effacé"));
  }, [dispatch, announce, t]);

  const { isTablet } = useWindowSize();

  const decodedDepartments = useMemo(() => {
    return query.departments.map((dep) => decodeHTMLEntities(dep));
  }, [query.departments]);

  const locationLabel = useMemo(() => {
    if (decodedDepartments.length === 0) {
      return t("Recherche.filterLocation", "Localisation");
    }

    const firstDepartment = decodedDepartments[0];

    if (departmentsNotDeployed.length > 0 && isTablet) {
      return `${firstDepartment} ⚠️`;
    }

    return firstDepartment;
  }, [t, decodedDepartments, departmentsNotDeployed, isTablet]);

  const statusOptions = useStatusOptions();
  const publicOptions = usePublicOptions();
  const ageOptions = useAgeOptions();
  const frenchLevelOptions = useFrenchLevelOptions();
  const languageOptions = useLanguagesOptions();

  const countsByFilter = useMemo(() => {
    if (!counts) return {};
    return {
      status: counts.statuses || {},
      public: counts.publics || {},
      age: counts.ageRanges || {},
      frenchLevel: counts.frenchLevels || {},
      language: counts.languages || {},
    };
  }, [counts]);

  return (
    <Container className={cls(styles.container, isSticky && styles.sticky)}>
      <SearchInput
        onFocus={onFocusSearchInput}
        onBlur={onBlurSearchInput}
        className={styles.searchZone}
        onChange={onChangeSearchInput}
      />
      <DropdownProvider>
        <div className={styles.filtersBar}>
          <Filter
            tooltip={
              departmentsNotDeployed.length > 0
                ? {
                    trigger: "⚠️",
                    text: decodeHTMLEntities(
                      t("Recherche.notDeployedText", {
                        department: departmentsNotDeployed.join(", "),
                      }),
                    ),
                  }
                : null
            }
            label={locationLabel}
            externalMenu={{
              value: decodedDepartments,
              reset: resetLocation,
              menu: <LocationMenu />,
            }}
            gaType="department"
          />
          <Filter
            label={themeLabel}
            externalMenu={{
              value: themeDisplayedValue,
              reset: resetTheme,
              menu: <ThemeMenu mobile={false} isOpen={true} /> /* TODO: fix isOpen here */,
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
