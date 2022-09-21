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
import { decodeQuery, queryDispositifs, queryDispositifsWithAlgolia } from "lib/filterContents";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import SearchResults from "components/Pages/recherche/SearchResults";
import { IDispositif, Theme } from "types/interface";
import { needsSelector } from "services/Needs/needs.selectors";
import { useRouter } from "next/router";
import { getPath } from "routes";

export type SearchQuery = {
  search: string;
  departmentsSelected: string[];
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
  ages?: string | AgeOptions[];
  frenchLevels?: string | FrenchOptions[];
  language?: string | string[];
  sort?: string | SortOptions;
  type?: string | TypeOptions;
};
export type Results = {
  dispositifs: IDispositif[];
  demarches: IDispositif[];
};

const debouncedQuery = debounce((query, dispositifs, callback) => {
  return queryDispositifsWithAlgolia(query, dispositifs).then(res => callback(res));
 }, 500);

const Recherche = () => {
  const dispositifs = useSelector(activeDispositifsSelector);
  const router = useRouter();
  const initialQuery = decodeQuery(router.query);

  // search
  const [search, setSearch] = useState("");
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>(initialQuery.needsSelected);
  const [themesSelected, setThemesSelected] = useState<Theme[]>([]);
  const [departmentsSelected, setDepartmentsSelected] = useState<string[]>(initialQuery.departmentsSelected);

  // additional search
  const [filterAge, setFilterAge] = useState<AgeOptions[]>(initialQuery.filterAge);
  const [filterFrenchLevel, setFilterFrenchLevel] = useState<FrenchOptions[]>(initialQuery.filterFrenchLevel);
  const [filterLanguage, setFilterLanguage] = useState<string[]>(initialQuery.filterLanguage);

  // sort and filter
  const [selectedSort, setSelectedSort] = useState<SortOptions>(initialQuery.selectedSort);
  const [selectedType, setSelectedType] = useState<TypeOptions>(initialQuery.selectedType);

  // results
  const [filteredResult, setFilteredResult] = useState<Results>(() => {
    const initialResults = queryDispositifs(initialQuery, dispositifs);
    return {
      dispositifs: initialResults.filter((d) => d.typeContenu === "dispositif"),
      demarches: initialResults.filter((d) => d.typeContenu === "demarche"),
    }
  });

  useEffect(() => {
    const updateUrl = () => {
      const urlQuery: UrlSearchQuery = {  }
      if (needsSelected) urlQuery.needs = needsSelected;
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
            search: newQueryString,
          },
          undefined,
          { locale: locale, shallow: true }
        );
      }
    };
    const query: SearchQuery = {
      search,
      needsSelected,
      departmentsSelected,
      filterAge,
      filterFrenchLevel,
      filterLanguage,
      selectedSort,
      selectedType
    };

    debouncedQuery(query, dispositifs, (res: any) => {
      setFilteredResult(res);
      updateUrl();
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

  // set themes selected based on needs
  const allNeeds = useSelector(needsSelector);
  useEffect(() => {
    const themes: Theme[] = [];
    for (const need of needsSelected) {
      const theme = allNeeds.find(n => n._id === need)?.theme
      if (theme) themes.push(theme);
    }
    setThemesSelected([...new Set(themes)])
  }, [needsSelected, allNeeds])

  return (
    <div className={cls(styles.container)}>
      <SEO title="Recherche" />
      <SearchHeader
        nbResults={filteredResult.dispositifs.length + filteredResult.demarches.length}
        search={search}
        setSearch={setSearch}
        needsSelected={needsSelected}
        setNeedsSelected={setNeedsSelected}
        themesSelected={themesSelected}
        departmentsSelected={departmentsSelected}
        setDepartmentsSelected={setDepartmentsSelected}
        filterAge={filterAge}
        setFilterAge={setFilterAge}
        filterFrenchLevel={filterFrenchLevel}
        setFilterFrenchLevel={setFilterFrenchLevel}
        filterLanguage={filterLanguage}
        setFilterLanguage={setFilterLanguage}
      />

      <Container className={styles.container_inner}>
        <ResultsFilter
          nbDemarches={filteredResult.demarches.length}
          nbDispositifs={filteredResult.dispositifs.length}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <SearchResults
          filteredResult={filteredResult}
          selectedType={selectedType}
          themesSelected={themesSelected}
        />
      </Container>
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
