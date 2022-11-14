import React, { useCallback, useEffect, useState } from "react";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import qs from "query-string";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "services/configureStore";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { needsSelector } from "services/Needs/needs.selectors";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { themesSelector } from "services/Themes/themes.selectors";
import { addToQueryActionCreator, setSearchResultsActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector, searchResultsSelector } from "services/SearchResults/searchResults.selector";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { cls } from "lib/classname";
import {
  getCountDispositifsForDepartment,
  queryDispositifs,
  queryDispositifsWithAlgolia
} from "lib/recherche/queryContents";
import decodeQuery from "lib/recherche/decodeUrlQuery";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { isHomeSearchVisible } from "lib/recherche/isHomeSearchVisible";
import { SearchDispositif, Need, Theme } from "types/interface";
import SEO from "components/Seo";
import SearchResults from "components/Pages/recherche/SearchResults";
import SearchHeader from "components/Pages/recherche/SearchHeader";
import HomeSearch from "components/Pages/recherche/HomeSearch";
import styles from "scss/pages/recherche.module.scss";
import { getPath } from "routes";

export type UrlSearchQuery = {
  departments?: string | string[];
  needs?: string | ObjectId[];
  themes?: string | ObjectId[];
  age?: string | AgeOptions[];
  frenchLevel?: string | FrenchOptions[];
  language?: string | string[];
  sort?: string | SortOptions;
  type?: string | TypeOptions;
  search?: string;
};

const debouncedQuery = debounce(
  (query: SearchQuery, dispositifs: SearchDispositif[], locale: string, callback: any) => {
    return queryDispositifsWithAlgolia(query, dispositifs, locale).then((res) => callback(res));
  },
  500
);

const Recherche = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const dispositifs = useSelector(activeDispositifsSelector);
  const languei18nCode = useSelector(languei18nSelector);
  const allNeeds = useSelector(needsSelector);
  const allThemes = useSelector(themesSelector);
  const query = useSelector(searchQuerySelector);
  const filteredResult = useSelector(searchResultsSelector);

  const [themesDisplayed, setThemesDisplayed] = useState<Theme[]>([]);
  const [showHome, setShowHome] = useState(true);

  useEffect(() => {
    // toggle home screen
    setShowHome(isHomeSearchVisible(query));

    // update url
    const updateUrl = () => {
      const locale = router.locale;
      const oldQueryString = qs.stringify(router.query, { arrayFormat: "comma" });
      const newQueryString = qs.stringify({ ...query }, { arrayFormat: "comma" });
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
    debouncedQuery(query, dispositifs, languei18nCode, (res: any) => {
      dispatch(setSearchResultsActionCreator(res));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dispositifs]);

  // set themes displayed based on needs
  useEffect(() => {
    const needs = query.needs.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as Need[];

    // get all themes displayed
    const newThemesDisplayed: Theme[] = [];
    for (const theme of query.themes) {
      const themeToAdd = allThemes.find((t) => t._id === theme);
      if (themeToAdd) newThemesDisplayed.push(themeToAdd);
    }
    for (const need of needs) {
      if (need.theme && !newThemesDisplayed.find((t) => t._id === need.theme._id)) {
        newThemesDisplayed.push(need.theme);
      }
    }
    setThemesDisplayed(newThemesDisplayed);
  }, [query.needs, query.themes, allNeeds, allThemes]);

  // check if department deployed
  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>([]);
  useEffect(() => {
    const newDepartmentsNotDeployed: string[] = [];
    for (const dep of query.departments) {
      const count = getCountDispositifsForDepartment(dep, dispositifs);
      if (count < 10) {
        newDepartmentsNotDeployed.push(dep);
      }
    }
    setDepartmentsNotDeployed(newDepartmentsNotDeployed);
  }, [query.departments, dispositifs]);

  const resetFilters = useCallback(() => {
    dispatch(
      addToQueryActionCreator({
        search: "",
        departments: [],
        themes: [],
        needs: [],
        age: [],
        frenchLevel: [],
        language: [],
        sort: "date",
        type: "all"
      })
    );
  }, [dispatch]);

  const nbResults =
    filteredResult.dispositifs.length +
    filteredResult.demarches.length +
    filteredResult.dispositifsSecondaryTheme.length;

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />
      <SearchHeader
        searchMinified={showHome}
        nbResults={nbResults}
        themesDisplayed={themesDisplayed}
        resetFilters={resetFilters}
      />

      {!showHome ? (
        <Container className={styles.container_inner}>
          <SearchResults
            themesSelected={themesDisplayed}
            departmentsNotDeployed={departmentsNotDeployed}
            resetFilters={resetFilters}
          />
        </Container>
      ) : (
        <HomeSearch
          demarches={filteredResult.demarches.slice(0, 15)}
          dispositifs={filteredResult.dispositifs.slice(0, 15)}
        />
      )}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, locale }) => {
  if (locale) {
    store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
  } else {
    store.dispatch(fetchActiveDispositifsActionsCreator());
  }
  store.dispatch(fetchNeedsActionCreator());
  store.dispatch(fetchThemesActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const initialQuery = decodeQuery(query, store.getState().themes.activeThemes);
  const results = queryDispositifs(initialQuery, store.getState().activeDispositifs);
  store.dispatch(setSearchResultsActionCreator(results));
  store.dispatch(addToQueryActionCreator(initialQuery));

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    }
  };
});

export default Recherche;
