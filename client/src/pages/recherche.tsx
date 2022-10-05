import React, { useEffect, useState } from "react";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { ObjectId } from "mongodb";
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
import { decodeQuery, getCountDispositifsForDepartment, queryDispositifs, queryDispositifsWithAlgolia } from "lib/filterContents";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import SearchResults from "components/Pages/recherche/SearchResults";
import { IDispositif, Need, Theme } from "types/interface";
import { needsSelector } from "services/Needs/needs.selectors";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { languei18nSelector } from "services/Langue/langue.selectors";
import HomeSearch from "components/Pages/recherche/HomeSearch";
import SearchHeaderMobile from "components/Pages/recherche/SearchHeaderMobile";

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
  dispositifs: IDispositif[];
  demarches: IDispositif[];
  dispositifsSecondaryTheme: IDispositif[];
};

const debouncedQuery = debounce((query, dispositifs, locale, callback) => {
  return queryDispositifsWithAlgolia(query, dispositifs, locale).then((res) => callback(res));
}, 500);

// TODO: move to lib
const getThemesSelected = (needsSelected: ObjectId[], allNeeds: Need[]): { themes: ObjectId[]; needs: ObjectId[] } => {
  const needs = needsSelected.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as Need[];

  // get all themes displayed
  const themesDisplayed: Theme[] = [];
  for (const need of needs) {
    if (need.theme && !themesDisplayed.find((t) => t._id === need.theme._id)) {
      themesDisplayed.push(need.theme);
    }
  }

  // for each theme displayed, if all needs selected, set theme selected
  const themesSelected: ObjectId[] = [];
  for (const themeDisplayed of themesDisplayed) {
    const totalNeedsOfTheme = allNeeds.filter((n) => n.theme._id === themeDisplayed._id).length;
    const countNeedsOfThemeSelected = needs.filter((n) => n.theme._id === themeDisplayed._id).length;
    if (totalNeedsOfTheme === countNeedsOfThemeSelected) {
      themesSelected.push(themeDisplayed._id);
    }
  }

  return {
    themes: themesSelected,
    needs: needs.filter((n) => !themesSelected.includes(n.theme._id)).map((n) => n._id)
  };
};

const Recherche = () => {
  const dispositifs = useSelector(activeDispositifsSelector);
  const router = useRouter();
  const initialQuery = decodeQuery(router.query);
  const languei18nCode = useSelector(languei18nSelector);

  // search
  const [search, setSearch] = useState("");
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>(initialQuery.needsSelected);
  const [themesDisplayed, setThemesDisplayed] = useState<Theme[]>([]); //TODO: fix here
  const [departmentsSelected, setDepartmentsSelected] = useState<string[]>(initialQuery.departmentsSelected);

  // additional search
  const [filterAge, setFilterAge] = useState<AgeOptions[]>(initialQuery.filterAge);
  const [filterFrenchLevel, setFilterFrenchLevel] = useState<FrenchOptions[]>(initialQuery.filterFrenchLevel);
  const [filterLanguage, setFilterLanguage] = useState<string[]>(initialQuery.filterLanguage);

  // sort and filter
  const [selectedSort, setSelectedSort] = useState<SortOptions>(initialQuery.selectedSort);
  const [selectedType, setSelectedType] = useState<TypeOptions>(initialQuery.selectedType);

  // results
  const [filteredResult, setFilteredResult] = useState<Results>(queryDispositifs(initialQuery, dispositifs));

  const [showHome, setShowHome] = useState(true);
  const allNeeds = useSelector(needsSelector);

  useEffect(() => {
    const { themes, needs } = getThemesSelected(needsSelected, allNeeds);

    // toggle home screen
    const hideHome =
      search ||
      needs.length ||
      themes.length ||
      departmentsSelected.length ||
      filterAge.length ||
      filterFrenchLevel.length ||
      filterLanguage.length ||
      selectedSort !== "date" ||
      selectedType !== "all";
    setShowHome(!hideHome);

    // update url
    const updateUrl = () => {
      const urlQuery: UrlSearchQuery = {};
      if (needs) urlQuery.needs = needs;
      if (themes) urlQuery.themes = themes;
      if (departmentsSelected) urlQuery.departments = departmentsSelected;
      if (filterAge) urlQuery.ages = filterAge;
      if (filterFrenchLevel) urlQuery.frenchLevels = filterFrenchLevel;
      if (filterLanguage) urlQuery.language = filterLanguage;
      if (selectedSort) urlQuery.sort = selectedSort;
      if (selectedType) urlQuery.type = selectedType;

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
      themesSelected: themes,
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
    const themesDisplayed: Theme[] = [];
    for (const need of needs) {
      if (need.theme && !themesDisplayed.find((t) => t._id === need.theme._id)) {
        themesDisplayed.push(need.theme);
      }
    }
    setThemesDisplayed(themesDisplayed);
  }, [needsSelected, allNeeds]);

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

  const resetFilters = () => {
    setSearch("");
    setNeedsSelected([]);
    setDepartmentsSelected([]);
    setFilterAge([]);
    setFilterFrenchLevel([]);
    setFilterLanguage([]);
  };

  return (
    <div className={cls(styles.container)}>
      <SEO title="Recherche" />
      <div className="d-none d-md-block">
        <SearchHeader
          searchMinified={showHome}
          nbResults={filteredResult.dispositifs.length + filteredResult.demarches.length}
          search={search}
          setSearch={setSearch}
          needsSelected={needsSelected}
          setNeedsSelected={setNeedsSelected}
          themesSelected={themesDisplayed}
          departmentsSelected={departmentsSelected}
          setDepartmentsSelected={setDepartmentsSelected}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          filterFrenchLevel={filterFrenchLevel}
          setFilterFrenchLevel={setFilterFrenchLevel}
          filterLanguage={filterLanguage}
          setFilterLanguage={setFilterLanguage}
          resetFilters={resetFilters}
        />
      </div>
      <div className="d-md-none">
        <SearchHeaderMobile
          search={search}
          setSearch={setSearch}
          needsSelected={needsSelected}
          setNeedsSelected={setNeedsSelected}
          themesSelected={themesDisplayed}
          departmentsSelected={departmentsSelected}
          setDepartmentsSelected={setDepartmentsSelected}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          filterFrenchLevel={filterFrenchLevel}
          setFilterFrenchLevel={setFilterFrenchLevel}
          filterLanguage={filterLanguage}
          setFilterLanguage={setFilterLanguage}
        />
      </div>

      {!showHome ? (
        <Container className={styles.container_inner}>
          <ResultsFilter
            nbDemarches={filteredResult.demarches.length}
            nbDispositifs={filteredResult.dispositifs.length}
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
          setNeedsSelected={setNeedsSelected}
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
