import React, { useCallback, useEffect, useState } from "react";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { ObjectId } from "mongodb";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import qs from "query-string";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "components/Seo";
import { wrapper } from "services/configureStore";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import styles from "scss/pages/recherche.module.scss";
import SearchHeader from "components/Pages/recherche/SearchHeader";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import ResultsFilter from "components/Pages/recherche/ResultsFilter";
import { getCountDispositifsForDepartment, queryDispositifs, queryDispositifsWithAlgolia } from "lib/recherche/queryContents";
import { decodeQuery } from "lib/recherche/decodeUrlQuery";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import SearchResults from "components/Pages/recherche/SearchResults";
import { SearchDispositif, Need, Theme } from "types/interface";
import { needsSelector } from "services/Needs/needs.selectors";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { languei18nSelector } from "services/Langue/langue.selectors";
import HomeSearch from "components/Pages/recherche/HomeSearch";
import { themesSelector } from "services/Themes/themes.selectors";

export type SearchQuery = {
  search: string;
  departmentsSelected: string[];
  themesSelected: ObjectId[];
  needsSelected: ObjectId[];
  filterAge: AgeOptions[];
  filterFrenchLevel: FrenchOptions[];
  filterLanguage: string[];
  selectedSort: SortOptions;
  selectedType: TypeOptions;
};
export type UrlSearchQuery = {
  departments?: string | string[];
  needs?: string | ObjectId[];
  themes?: string | ObjectId[];
  ages?: string | AgeOptions[];
  frenchLevels?: string | FrenchOptions[];
  language?: string | string[];
  sort?: string | SortOptions;
  type?: string | TypeOptions;
};
export type Results = {
  dispositifs: SearchDispositif[];
  demarches: SearchDispositif[];
  dispositifsSecondaryTheme: SearchDispositif[];
};

const debouncedQuery = debounce((query: SearchQuery, dispositifs: SearchDispositif[], locale: string, callback: any) => {
  return queryDispositifsWithAlgolia(query, dispositifs, locale).then((res) => callback(res));
}, 500);

const Recherche = () => {
  const { t } = useTranslation();
  const dispositifs = useSelector(activeDispositifsSelector);
  const router = useRouter();
  const initialQuery = decodeQuery(router.query);
  const languei18nCode = useSelector(languei18nSelector);
  const allNeeds = useSelector(needsSelector);
  const allThemes = useSelector(themesSelector);

  // search
  const [search, setSearch] = useState("");
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>(initialQuery.needsSelected);
  const [themesSelected, setThemesSelected] = useState<ObjectId[]>(initialQuery.themesSelected);
  const [themesDisplayed, setThemesDisplayed] = useState<Theme[]>([]);
  const [departmentsSelected, setDepartmentsSelected] = useState<string[]>(initialQuery.departmentsSelected);

  // additional search
  const [filterAge, setFilterAge] = useState<AgeOptions[]>(initialQuery.filterAge);
  const [filterFrenchLevel, setFilterFrenchLevel] = useState<FrenchOptions[]>(initialQuery.filterFrenchLevel);
  const [filterLanguage, setFilterLanguage] = useState<string[]>(initialQuery.filterLanguage);

  // sort and filter
  const [selectedSort, setSelectedSort] = useState<SortOptions>(initialQuery.selectedSort);
  const [selectedType, setSelectedType] = useState<TypeOptions>(initialQuery.selectedType);

  // results
  const [filteredResult, setFilteredResult] = useState<Results>(() => queryDispositifs(initialQuery, dispositifs));

  const [showHome, setShowHome] = useState(true);

  useEffect(() => {
    // toggle home screen
    const hideHome =
      search ||
      needsSelected.length ||
      themesSelected.length ||
      departmentsSelected.length ||
      filterAge.length ||
      filterFrenchLevel.length ||
      filterLanguage.length ||
      selectedSort !== "date" ||
      selectedType !== "all";
    setShowHome(!hideHome);

    // update url
    const updateUrl = () => {
      const urlQuery: UrlSearchQuery = {
        needs: needsSelected,
        themes: themesSelected,
        departments: departmentsSelected,
        ages: filterAge,
        frenchLevels: filterFrenchLevel,
        language: filterLanguage,
        sort: selectedSort,
        type: selectedType,
      };

      const locale = router.locale;
      const oldQueryString = qs.stringify(router.query, { arrayFormat: "comma" });
      const newQueryString = qs.stringify(urlQuery, { arrayFormat: "comma" });
      if (oldQueryString !== newQueryString) {
        router.push(
          {
            pathname: getPath("/recherche", router.locale),
            search: newQueryString
          },
          undefined,
          { locale: locale, shallow: true }
        );
      }
    };

    updateUrl();

    // query dispositifs
    const query: SearchQuery = {
      search,
      needsSelected,
      themesSelected,
      departmentsSelected,
      filterAge,
      filterFrenchLevel,
      filterLanguage,
      selectedSort,
      selectedType
    };
    debouncedQuery(query, dispositifs, languei18nCode, (res: any) => {
      setFilteredResult(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    needsSelected,
    themesSelected,
    departmentsSelected,
    filterAge,
    filterFrenchLevel,
    filterLanguage,
    selectedSort,
    selectedType,
    dispositifs
  ]);

  // set themes displayed based on needs
  useEffect(() => {
    const needs = needsSelected.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as Need[];

    // get all themes displayed
    const newThemesDisplayed: Theme[] = [];
    for (const theme of themesSelected) {
      const themeToAdd = allThemes.find(t => t._id === theme);
      if (themeToAdd) newThemesDisplayed.push(themeToAdd);
    }
    for (const need of needs) {
      if (need.theme && !newThemesDisplayed.find((t) => t._id === need.theme._id)) {
        newThemesDisplayed.push(need.theme);
      }
    }
    setThemesDisplayed(newThemesDisplayed);
  }, [needsSelected, themesSelected, allNeeds, allThemes]);

  // check if department deployed
  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>([]);
  useEffect(() => {
    const newDepartmentsNotDeployed: string[] = [];
    for (const dep of departmentsSelected) {
      const count = getCountDispositifsForDepartment(dep, dispositifs);
      if (count < 10) {
        newDepartmentsNotDeployed.push(dep);
      }
    }
    setDepartmentsNotDeployed(newDepartmentsNotDeployed);
  }, [departmentsSelected, dispositifs])

  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedType("all")
    setNeedsSelected([]);
    setThemesSelected([]);
    setDepartmentsSelected([]);
    setFilterAge([]);
    setFilterFrenchLevel([]);
    setFilterLanguage([]);
  }, []);

  const nbResults = filteredResult.dispositifs.length +
    filteredResult.demarches.length +
    filteredResult.dispositifsSecondaryTheme.length;

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />
      <SearchHeader
        searchMinified={showHome}
        nbResults={nbResults}
        themesDisplayed={themesDisplayed}
        searchState={[search, setSearch]}
        needsSelectedState={[needsSelected, setNeedsSelected]}
        themesSelectedState={[themesSelected, setThemesSelected]}
        departmentsSelectedState={[departmentsSelected, setDepartmentsSelected]}
        filterAgeState={[filterAge, setFilterAge]}
        filterFrenchLevelState={[filterFrenchLevel, setFilterFrenchLevel]}
        filterLanguageState={[filterLanguage, setFilterLanguage]}
        resetFilters={resetFilters}
      />

      {!showHome ? (
        <Container className={styles.container_inner}>
          <ResultsFilter
            nbDemarches={filteredResult.demarches.length}
            nbDispositifs={filteredResult.dispositifs.length + filteredResult.dispositifsSecondaryTheme.length}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showSort={!search}
          />
          <SearchResults
            filteredResult={filteredResult}
            selectedType={selectedType}
            themesSelected={themesDisplayed}
            departmentsSelected={departmentsSelected}
            departmentsNotDeployed={departmentsNotDeployed}
            resetFilters={resetFilters}
          />
        </Container>
      ) : (
        <HomeSearch
          setDepartmentsSelected={setDepartmentsSelected}
          setSelectedType={setSelectedType}
          setThemesSelected={setThemesSelected}
          demarches={filteredResult.demarches.slice(0, 5)}
          dispositifs={filteredResult.dispositifs.slice(0, 4)}
        />
      )}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ locale }) => {
  if (locale) {
    store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
  } else {
    store.dispatch(fetchActiveDispositifsActionsCreator());
  }
  store.dispatch(fetchNeedsActionCreator());
  store.dispatch(fetchThemesActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    }
  };
});

export default Recherche;
