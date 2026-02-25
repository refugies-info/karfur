import type { Id } from "@refugies-info/api-types";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { getPath, isRoute } from "routes";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import SearchHeader from "~/components/Pages/recherche/SearchHeader";
import SearchResults from "~/components/Pages/recherche/SearchResults";
import SEO from "~/components/Seo";
import { useLocale, useUtmz } from "~/hooks";
import { cls } from "~/lib/classname";
import dbConnect from "~/lib/db";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import decodeQuery from "~/lib/recherche/decodeUrlQuery";
import { buildQueryParams, computeSearchResults } from "~/lib/search-helpers";
import { computeSearchCounts, type SearchCountsResponse } from "~/pages/api/search/counts";
import styles from "~/scss/pages/recherche.module.scss";
import { wrapper } from "~/services/configureStore";
import { toggleLangueActionCreator } from "~/services/Langue/langue.actions";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { fetchSearchCountsSuccess } from "~/services/SearchCounts/searchCounts.reducer";
import { searchCountsDataSelector } from "~/services/SearchCounts/searchCounts.selector";
import {
  addToQueryActionCreator,
  fetchSearchResultsRequest,
  fetchSearchResultsSuccess,
} from "~/services/SearchResults/searchResults.actions";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  searchPaginationSelector,
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
    type,
    sort,
  } = q;
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
    type,
    sort,
  };
};

const Recherche = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const { params } = useUtmz();

  const counts = useSelector(searchCountsDataSelector);
  const query = useSelector(searchQuerySelector);
  const pagination = useSelector(searchPaginationSelector);

  // Stable refs for values used inside debounce (avoids stale closures and re-creating the fn)
  const routerRef = useRef(router);
  const localeRef = useRef(locale);
  const paramsRef = useRef(params);
  routerRef.current = router;
  localeRef.current = locale;
  paramsRef.current = params;

  const debouncedSearchAndUrlUpdate = useCallback(
    debounce((currentQuery: SearchQuery) => {
      dispatch(fetchSearchResultsRequest(currentQuery));

      const oldQueryString = routerRef.current.asPath.split("?")[1] || "";
      const newQueryString = buildUrlQuery(currentQuery, paramsRef.current);
      if (oldQueryString !== newQueryString) {
        routerRef.current.push(
          {
            pathname: getPath("/recherche", localeRef.current),
            search: newQueryString,
          },
          undefined,
          { locale: localeRef.current, shallow: true },
        );
      }
    }, 500),
    [dispatch],
  );

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

  // Fetch results and update URL when query changes (debounced)
  const prevRelevantRef = useRef<ReturnType<typeof pickRelevantFilters> | null>(null);
  useEffect(() => {
    const currentRelevant = pickRelevantFilters(query);
    const prevRelevant = prevRelevantRef.current;
    const changed = JSON.stringify(prevRelevant) !== JSON.stringify(currentRelevant);
    if (!isNavigating && changed && prevRelevant !== null) {
      debouncedSearchAndUrlUpdate(query);
    }
    prevRelevantRef.current = currentRelevant;
  }, [query, isNavigating, debouncedSearchAndUrlUpdate]);

  return (
    <div className={cls(styles.container)}>
      <SEO title={t("Recherche.pageTitle", "Recherche")} />

      <HelpNotice />
      <SearchHeader counts={counts} nbResults={pagination.total} />
      <SearchResults />
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      // Fetch themes and needs via existing sagas (from Express server)
      // NOTE: We do NOT dispatch toggleLangueActionCreator here because its saga
      // triggers fetchActiveDispositifsActionsCreator which loads ALL dispositifs.
      // Instead we dispatch it AFTER sagas end so only the reducer runs (sets locale).
      store.dispatch(fetchNeedsActionCreator());
      store.dispatch(fetchThemesActionCreator());
      store.dispatch(END);
      await store.sagaTask?.toPromise();

      // Set locale in reducer only (sagas are already stopped, no dispositifs fetch)
      if (locale) {
        store.dispatch(toggleLangueActionCreator(locale));
      }

      // Decode URL query into SearchQuery
      const initialQuery = decodeQuery(query, store.getState().themes.activeThemes);
      store.dispatch(addToQueryActionCreator(initialQuery));

      // Fetch initial search results directly from MongoDB (no API route call)
      try {
        const conn = await dbConnect();
        const queryParams = buildQueryParams({
          search: initialQuery.search || undefined,
          departments: initialQuery.departments,
          themes: initialQuery.themes.map(String),
          needs: initialQuery.needs.map(String),
          age: initialQuery.age,
          frenchLevel: initialQuery.frenchLevel,
          public: initialQuery.public,
          status: initialQuery.status,
          language: initialQuery.language,
        });

        const countsDisabled = process.env.DISABLE_SEARCH_COUNTS === "true";

        const [searchResponse, countsResponse] = await Promise.all([
          computeSearchResults(conn, queryParams, {
            page: 1,
            limit: 24,
            type: initialQuery.type !== "all" ? initialQuery.type : undefined,
            sort: initialQuery.sort !== "default" ? initialQuery.sort : undefined,
          }),
          countsDisabled ? Promise.resolve(null) : computeSearchCounts(conn, queryParams),
        ]);

        // Serialize to strip Mongoose ObjectIds / BSON types that Next.js can't serialize
        const serializedSearch = JSON.parse(JSON.stringify(searchResponse));
        store.dispatch(fetchSearchResultsSuccess(serializedSearch));
        if (countsResponse) {
          store.dispatch(fetchSearchCountsSuccess(JSON.parse(JSON.stringify(countsResponse))));
        }
      } catch (error) {
        // If DB connection fails, render with empty results (client will retry)
        console.error("SSR search failed:", error);
      }

      return {
        props: {
          ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
        },
      };
    },
);

export default Recherche;
