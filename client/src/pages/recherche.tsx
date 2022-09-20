import React, { useEffect, useState } from "react";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { ObjectId } from "mongodb";
import { debounce } from "lodash";
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
import { queryDispositifs } from "lib/filterContents";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import SearchResults from "components/Pages/recherche/SearchResults";
import { IDispositif } from "types/interface";

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
export type Results = {
  dispositifs: IDispositif[];
  demarches: IDispositif[];
};

const debouncedQuery = debounce((query, dispositifs, setResult) => {
  return queryDispositifs(query, dispositifs).then(res => setResult(res));
 }, 500);

const Recherche = () => {
  const dispositifs = useSelector(activeDispositifsSelector);

  // search
  const [search, setSearch] = useState("");
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>([]);
  const [departmentsSelected, setDepartmentsSelected] = useState<string[]>([]);

  // additional search
  const [filterAge, setFilterAge] = useState<AgeOptions[]>([]);
  const [filterFrenchLevel, setFilterFrenchLevel] = useState<FrenchOptions[]>([]);
  const [filterLanguage, setFilterLanguage] = useState<string[]>([]);

  // sort and filter
  const [selectedSort, setSelectedSort] = useState<SortOptions>("view");
  const [selectedType, setSelectedType] = useState<TypeOptions>("all");

  // results
  const [filteredResult, setFilteredResult] = useState<Results>({
    dispositifs: dispositifs.filter((d) => d.typeContenu === "dispositif"),
    demarches: dispositifs.filter((d) => d.typeContenu === "demarche"),
  })

  useEffect(() => {
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

    debouncedQuery(query, dispositifs, setFilteredResult);
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

  return (
    <div className={cls(styles.container)}>
      <SEO title="Recherche" />
      <SearchHeader
        nbResults={filteredResult.dispositifs.length + filteredResult.demarches.length}
        search={search}
        setSearch={setSearch}
        needsSelected={needsSelected}
        setNeedsSelected={setNeedsSelected}
        departmentsSelected={departmentsSelected}
        setDepartmentsSelected={setDepartmentsSelected}
        filterAge={filterAge}
        setFilterAge={setFilterAge}
        filterFrenchLevel={filterFrenchLevel}
        setFilterFrenchLevel={setFilterFrenchLevel}
        filterLanguage={filterLanguage}
        setFilterLanguage={setFilterLanguage}
      />

      <Container>
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
