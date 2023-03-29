import React, { useCallback, useEffect, useState } from "react";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import debounce from "lodash/debounce";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetDispositifsResponse, Id } from "api-types";
import { wrapper } from "services/configureStore";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { addToQueryActionCreator, setSearchResultsActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector, searchResultsSelector } from "services/SearchResults/searchResults.selector";
import { Results, SearchQuery } from "services/SearchResults/searchResults.reducer";
import { cls } from "lib/classname";
import { queryDispositifs, queryDispositifsWithAlgolia } from "lib/recherche/queryContents";
import decodeQuery from "lib/recherche/decodeUrlQuery";
import { buildUrlQuery } from "lib/recherche/buildUrlQuery";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { isHomeSearchVisible } from "lib/recherche/isHomeSearchVisible";
import { getDepartmentsNotDeployed } from "lib/recherche/functions";
import { generateLightResults } from "lib/recherche/generateLightResults";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import SearchResults from "components/Pages/recherche/SearchResults";
import SearchHeader from "components/Pages/recherche/SearchHeader";
import HomeSearch from "components/Pages/recherche/HomeSearch";
import NewSearchModal from "components/Modals/NewSearchModal/NewSearchModal";
import { getPath, isRoute } from "routes";
import styles from "scss/pages/recherche.module.scss";

export type UrlSearchQuery = {
  departments?: string | string[];
  needs?: string | Id[];
  themes?: string | Id[];
  age?: string | AgeOptions[];
  frenchLevel?: string | FrenchOptions[];
  language?: string | string[];
  sort?: string | SortOptions;
  type?: string | TypeOptions;
  search?: string;
};

const MODAL_STORAGE_KEY = "hideNewModal";

const debouncedQuery = debounce(
  (query: SearchQuery, dispositifs: GetDispositifsResponse[], locale: string, callback: (res: Results) => void) => {
    return queryDispositifsWithAlgolia(query, dispositifs, locale).then((res: Results) => callback(res));
  },
  500,
);

const Recherche = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const dispositifs = useSelector(activeDispositifsSelector);
  const languei18nCode = useSelector(languei18nSelector);
  const query = useSelector(searchQuerySelector);
  const filteredResult = useSelector(searchResultsSelector);

  const [showHome, setShowHome] = useState(isHomeSearchVisible(query));

  // new search modal
  const hasSeenModal = isInBrowser() ? localStorage.getItem(MODAL_STORAGE_KEY) : true;
  const [showModal, setShowModal] = useState(!hasSeenModal);
  const toggleModal = useCallback(() => {
    setShowModal((s) => !s);
    localStorage.setItem(MODAL_STORAGE_KEY, "true");
  }, [setShowModal]);

  // when navigating, save state to prevent loop on search page
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!isRoute(url, "/recherche")) setIsNavigating(true);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    // toggle home screen
    setShowHome(isHomeSearchVisible(query));

    // update url
    const updateUrl = () => {
      const locale = router.locale;
      const oldQueryString = router.asPath.split("?")[1] || "";
      const newQueryString = buildUrlQuery(query);
      if (oldQueryString !== newQueryString) {
        router.push(
          {
            pathname: getPath("/recherche", router.locale),
            search: newQueryString,
          },
          undefined,
          { locale: locale, shallow: true },
        );
      }
    };

    // query dispositifs
    if (!isNavigating) {
      debouncedQuery(query, dispositifs, languei18nCode, (res) => {
        updateUrl();
        dispatch(setSearchResultsActionCreator(res));
      });
    }
  }, [query, dispositifs, dispatch, router, isNavigating, languei18nCode]);

  // check if department deployed
  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>(
    getDepartmentsNotDeployed(query.departments, dispositifs),
  );
  useEffect(() => {
    setDepartmentsNotDeployed(getDepartmentsNotDeployed(query.departments, dispositifs));
  }, [query.departments, dispositifs]);

  const nbResults =
    filteredResult.dispositifs.length +
    filteredResult.demarches.length +
    filteredResult.dispositifsSecondaryTheme.length;

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />
      <SearchHeader searchMinified={showHome} nbResults={nbResults} />

      {!showHome ? (
        <Container className={styles.container_inner}>
          <SearchResults departmentsNotDeployed={departmentsNotDeployed} />
        </Container>
      ) : (
        <HomeSearch />
      )}

      {!hasSeenModal && <NewSearchModal show={showModal} toggle={toggleModal} />}
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
  store.dispatch(addToQueryActionCreator(initialQuery));

  const homeVisible = isHomeSearchVisible(initialQuery);
  const results = queryDispositifs(initialQuery, store.getState().activeDispositifs);
  store.dispatch(setSearchResultsActionCreator(generateLightResults(results, homeVisible)));

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default Recherche;
