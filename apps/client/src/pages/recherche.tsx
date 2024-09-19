import { GetDispositifsResponse, Id } from "@refugies-info/api-types";
import { AgeOptions, FrenchOptions, PublicOptions, SortOptions, StatusOptions, TypeOptions } from "data/searchFilters";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { getPath, isRoute } from "routes";
import SearchHeader from "~/components/Pages/recherche/SearchHeader";
import SearchResults from "~/components/Pages/recherche/SearchResults";
import SEO from "~/components/Seo";
import { useUtmz } from "~/hooks";
import { cls } from "~/lib/classname";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import decodeQuery from "~/lib/recherche/decodeUrlQuery";
import { getDepartmentsNotDeployed } from "~/lib/recherche/functions";
import { generateLightResults } from "~/lib/recherche/generateLightResults";
import { queryDispositifs, queryDispositifsWithAlgolia } from "~/lib/recherche/queryContents";
import styles from "~/scss/pages/recherche.module.scss";
import { fetchActiveDispositifsActionsCreator } from "~/services/ActiveDispositifs/activeDispositifs.actions";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { wrapper } from "~/services/configureStore";
import { toggleLangueActionCreator } from "~/services/Langue/langue.actions";
import { languei18nSelector } from "~/services/Langue/langue.selectors";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { addToQueryActionCreator, setSearchResultsActionCreator } from "~/services/SearchResults/searchResults.actions";
import { Results, SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import { searchQuerySelector, searchResultsSelector } from "~/services/SearchResults/searchResults.selector";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";

export type UrlSearchQuery = {
  departments?: string | string[];
  needs?: string | Id[];
  themes?: string | Id[];
  age?: string | AgeOptions[];
  frenchLevel?: string | FrenchOptions[];
  public?: string | PublicOptions[];
  status?: string | StatusOptions[];
  language?: string | string[];
  sort?: string | SortOptions;
  type?: string | TypeOptions;
  search?: string;
};

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
  const { params } = useUtmz();

  const dispositifs = useSelector(activeDispositifsSelector);
  const languei18nCode = useSelector(languei18nSelector);
  const query = useSelector(searchQuerySelector);
  const filteredResult = useSelector(searchResultsSelector);

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
    // update url
    const updateUrl = () => {
      const locale = router.locale;
      const oldQueryString = router.asPath.split("?")[1] || "";
      const newQueryString = buildUrlQuery(query, params);
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
  }, [query, dispositifs, dispatch, router, isNavigating, languei18nCode, params]);

  // check if department deployed
  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>(
    getDepartmentsNotDeployed(query.departments, dispositifs),
  );
  useEffect(() => {
    setDepartmentsNotDeployed(getDepartmentsNotDeployed(query.departments, dispositifs));
  }, [query.departments, dispositifs]);

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />
      <SearchHeader nbResults={dispositifs.length} />
      <SearchResults departmentsNotDeployed={departmentsNotDeployed} />
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

  const results = queryDispositifs(initialQuery, store.getState().activeDispositifs);
  store.dispatch(setSearchResultsActionCreator(generateLightResults(results)));

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default Recherche;
