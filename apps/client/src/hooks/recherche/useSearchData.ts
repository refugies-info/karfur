import type { SimpleDispositif } from "@refugies-info/api-types";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";
import useSWR from "swr";
import { usePaginatedResults } from "~/hooks/usePaginatedResults";
import type { SearchResponse } from "~/lib/search-helpers";
import { logger } from "~/logger";
import type { SearchCountsResponse } from "~/pages/api/search/counts";
import {
  getSearchCounts,
  SEARCH_COUNTS_CACHE_KEY,
} from "~/services/SearchCounts/searchCounts.service";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  fetchSearchResultsPage,
  SEARCH_RESULTS_CACHE_KEY,
  type SearchResultsParams,
} from "~/services/SearchResults/searchResults.service";

const NO_DISPOSITIFS: SimpleDispositif[] = [];
const COUNTS_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SEARCH_COUNTS === "true";

interface UseSearchDataOptions {
  query: SearchQuery;
  locale: string;
  /** Data rendered by the server for `initialQuery`, to avoid an empty first paint. */
  initialQuery: SearchQuery;
  initialResults?: SearchResponse | null;
  initialCounts?: SearchCountsResponse | null;
}

// Tab and sort only change how results are presented, not what the counts are computed on.
const toCountsQuery = ({ sort, type, ...filters }: SearchQuery) => filters;

export const useSearchData = ({
  query,
  locale,
  initialQuery,
  initialResults,
  initialCounts,
}: UseSearchDataOptions) => {
  const isInitialQuery = isEqual(query, initialQuery);
  const countsQuery = useMemo(() => toCountsQuery(query), [query]);
  const isInitialCountsQuery = isEqual(countsQuery, toCountsQuery(initialQuery));

  const search = usePaginatedResults<SearchResultsParams, SimpleDispositif, SearchResponse>({
    cacheKey: SEARCH_RESULTS_CACHE_KEY,
    params: { query, locale },
    fetchPage: fetchSearchResultsPage,
    logLabel: "[recherche]",
    initialData: isInitialQuery ? (initialResults ?? undefined) : undefined,
  });

  const { data: counts } = useSWR<SearchCountsResponse>(
    COUNTS_DISABLED ? null : [SEARCH_COUNTS_CACHE_KEY, countsQuery],
    ([, keyQuery]: readonly [string, ReturnType<typeof toCountsQuery>]) =>
      getSearchCounts(keyQuery),
    {
      fallbackData: isInitialCountsQuery ? (initialCounts ?? undefined) : undefined,
      keepPreviousData: true,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (error) => logger.error("[recherche] fetching counts failed", { error }),
    },
  );

  return {
    ...search,
    suggestions: search.firstPage?.suggestions ?? NO_DISPOSITIFS,
    noResults: search.firstPage?.noResults ?? NO_DISPOSITIFS,
    counts: counts ?? null,
  };
};
