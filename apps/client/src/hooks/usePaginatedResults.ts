import useSWRInfinite from "swr/infinite";
import { logger } from "~/logger";

export interface PaginatedResponse<TItem> {
  results: TItem[];
  total: number;
  page: number;
  pageCount: number;
}

interface UsePaginatedResultsOptions<TParams, TResponse> {
  cacheKey: string;
  params: TParams | null;
  fetchPage: (params: TParams, page: number) => Promise<TResponse>;
  logLabel: string;
}

/**
 * Loads a paginated list ("load more" pattern) and keeps the pages already loaded.
 * `firstPage` carries the extra fields of the response (counters, suggestions...).
 */
export const usePaginatedResults = <
  TParams,
  TItem,
  TResponse extends PaginatedResponse<TItem> = PaginatedResponse<TItem>,
>({
  cacheKey,
  params,
  fetchPage,
  logLabel,
}: UsePaginatedResultsOptions<TParams, TResponse>) => {
  const getKey = (pageIndex: number, previousPage: TResponse | null) => {
    if (params === null) return null;
    if (previousPage && previousPage.page >= previousPage.pageCount) return null;
    return [cacheKey, params, pageIndex + 1] as const;
  };

  const {
    data,
    error,
    isLoading: isRequestLoading,
    isValidating,
    size,
    setSize,
  } = useSWRInfinite<TResponse>(
    getKey,
    ([, keyParams, page]: readonly [string, TParams, number]) => fetchPage(keyParams, page),
    {
      keepPreviousData: true,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => logger.error(`${logLabel} fetching results failed`, { error: err }),
    },
  );

  const hasSearchError = Boolean(error) && size === 1;
  const pages = hasSearchError ? [] : (data ?? []);
  const lastPage = pages[pages.length - 1];
  const isLoadingMore = isValidating && size > pages.length;
  const isLoading = params === null || isRequestLoading;

  return {
    results: pages.flatMap((page) => page.results),
    firstPage: pages[0] as TResponse | undefined,
    totalResultsCount: pages[0]?.total ?? 0,
    currentPage: lastPage?.page ?? 1,
    totalPageCount: lastPage?.pageCount ?? 0,
    isLoading,
    isLoadingMore,
    error: hasSearchError,
    loadMore: () => {
      void setSize((current) => current + 1);
    },
  };
};
