import React, { useEffect, useState } from "react";
import { END } from "redux-saga";
import SEO from "components/Seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "services/configureStore";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import styles from "scss/pages/recherche.module.scss";
import SearchHeader from "components/Pages/recherche/SearchHeader";
import { useSelector } from "react-redux";
import DemarcheCard from "components/Pages/recherche/DemarcheCard";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { Container } from "reactstrap";
import DispositifCard from "components/Pages/recherche/DispositifCard";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import ResultsFilter from "components/Pages/recherche/ResultsFilter";
import { ObjectId } from "mongodb";
import { queryDispositifs } from "lib/filterContents";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";

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
  const [filteredDispositifs, setFilteredDispositifs] = useState(dispositifs.filter((d) => d.typeContenu === "dispositif"))
  const [filteredDemarches, setFilteredDemarches] = useState(dispositifs.filter((d) => d.typeContenu === "demarche"))

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

    const res = queryDispositifs(query, dispositifs);
    setFilteredDispositifs(res.dispositifs);
    setFilteredDemarches(res.dispositifs);
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
        nbResults={dispositifs.length}
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
          nbDemarches={dispositifs.filter((d) => d.typeContenu === "demarche").length}
          nbDispositifs={dispositifs.filter((d) => d.typeContenu === "dispositif").length}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <div className="d-flex flex-wrap">
          {filteredDispositifs
            .map((d, i) => (
              <DispositifCard key={i} dispositif={d} />
            ))}
        </div>

        <div className="d-flex flex-wrap">
          {filteredDemarches
            .map((d, i) => (
              <DemarcheCard key={i} demarche={d} />
            ))}
        </div>
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
