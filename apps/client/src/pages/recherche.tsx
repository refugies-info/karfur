import type { GetNeedResponse, Id, SimpleDispositif } from "@refugies-info/api-types";
import type {
  AgeOptions,
  FrenchOptions,
  PublicOptions,
  SortOptions,
  StatusOptions,
  TypeOptions,
} from "data/searchFilters";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { getPath, isRoute } from "routes";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import SearchHeader from "~/components/Pages/recherche/SearchHeader";
import SearchResults from "~/components/Pages/recherche/SearchResults";
import SEO from "~/components/Seo";
import { useLocale, useUtmz } from "~/hooks";
import { cls } from "~/lib/classname";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import decodeQuery from "~/lib/recherche/decodeUrlQuery";
import { generateLightResults } from "~/lib/recherche/generateLightResults";
import {
  getTopDemarches,
  queryDispositifs,
  queryDispositifsWithAlgolia,
} from "~/lib/recherche/queryContents";
import styles from "~/scss/pages/recherche.module.scss";
import { fetchActiveDispositifsActionsCreator } from "~/services/ActiveDispositifs/activeDispositifs.actions";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { wrapper } from "~/services/configureStore";
import { toggleLangueActionCreator } from "~/services/Langue/langue.actions";
import { languei18nSelector } from "~/services/Langue/langue.selectors";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { fetchSearchCountsRequest } from "~/services/SearchCounts/searchCounts.reducer";
import { searchCountsDataSelector } from "~/services/SearchCounts/searchCounts.selector";
import {
  addToQueryActionCreator,
  setNoResultsActionCreator,
  setSearchResultsActionCreator,
} from "~/services/SearchResults/searchResults.actions";
import type { Results, SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  noResultsSelector,
  searchQuerySelector,
} from "~/services/SearchResults/searchResults.selector";
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
  (
    query: SearchQuery,
    dispositifs: SimpleDispositif[],
    locale: string,
    allNeeds: GetNeedResponse[],
    callback: (res: Results) => void,
  ) => {
    return queryDispositifsWithAlgolia(query, dispositifs, locale, allNeeds).then((res: Results) =>
      callback(res),
    );
  },
  500,
);

const pickRelevantFilters = (q: SearchQuery) => {
  const {
    search,
    departments,
    themes,
    needs,
    age,
    frenchLevel,
    public: publicFilter,
    status,
    language,
  } = q;
  // Normalize empty search to empty string for stable comparison
  const normSearch = typeof search === "string" ? search.trim() : "";
  return {
    search: normSearch,
    departments,
    themes,
    needs,
    age,
    frenchLevel,
    public: publicFilter,
    status,
    language,
  };
};

const Recherche = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const { params } = useUtmz();

  const dispositifs = useSelector(activeDispositifsSelector);
  const noResults = useSelector(noResultsSelector);
  const counts = useSelector(searchCountsDataSelector);
  const languei18nCode = useSelector(languei18nSelector);
  const query = useSelector(searchQuerySelector);
  const allNeeds = useSelector(needsSelector);

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

  // fetch counts when relevant filters change (including when cleared). Ignores tab/sort-only changes.
  const prevRelevantRef = useRef<ReturnType<typeof pickRelevantFilters> | null>(null);
  useEffect(() => {
    const currentRelevant = pickRelevantFilters(query);
    const prevRelevant = prevRelevantRef.current;
    const changed = JSON.stringify(prevRelevant) !== JSON.stringify(currentRelevant);
    if (!isNavigating && changed) {
      dispatch(fetchSearchCountsRequest(query));
    }
    prevRelevantRef.current = currentRelevant;
  }, [query, isNavigating, dispatch]);

  // update URL and fetch search results (debounced)
  useEffect(() => {
    const updateUrl = () => {
      const oldQueryString = router.asPath.split("?")[1] || "";
      const newQueryString = buildUrlQuery(query, params);
      if (oldQueryString !== newQueryString) {
        router.push(
          {
            pathname: getPath("/recherche", locale),
            search: newQueryString,
          },
          undefined,
          { locale: locale, shallow: true },
        );
      }
    };

    if (!isNavigating) {
      debouncedQuery(query, dispositifs, languei18nCode, allNeeds, (res) => {
        updateUrl();
        dispatch(setSearchResultsActionCreator(res));
      });
    }
  }, [
    query,
    dispositifs,
    router,
    isNavigating,
    languei18nCode,
    params,
    allNeeds,
    locale,
    dispatch,
  ]);

  // generate list of demarches to show when no results
  useEffect(() => {
    if (noResults.length === 0) {
      dispatch(setNoResultsActionCreator(getTopDemarches(dispositifs)));
    }
  }, [noResults, dispositifs, dispatch]);

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />

      <HelpNotice />
      <SearchHeader counts={counts} nbResults={dispositifs.length} />
      <SearchResults />
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
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

      const results = queryDispositifs(
        initialQuery,
        store.getState().activeDispositifs,
        store.getState().needs,
      );
      store.dispatch(setSearchResultsActionCreator(generateLightResults(results)));

      return {
        props: {
          ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
        },
      };
    },
);

export default Recherche;
