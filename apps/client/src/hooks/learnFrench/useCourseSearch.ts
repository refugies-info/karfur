import type { SimpleDispositif } from "@refugies-info/api-types";
import { useEffect, useRef, useState } from "react";
import {
  CourseTab,
  type CourseTab as CourseTabType,
  type FiltersState,
} from "~/components/Pages/learnFrench";
import { LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import useLocale from "~/hooks/useLocale";

const RESULTS_PER_PAGE = 10;

interface CourseSearchResponse {
  results: SimpleDispositif[];
  total: number;
  page: number;
  pageCount: number;
}

const buildSearchParams = (
  filters: FiltersState,
  search: string,
  activeTab: CourseTabType,
  page: number,
  locale: string,
): URLSearchParams => {
  const usp = new URLSearchParams();
  usp.set("page", String(page));
  usp.set("limit", String(RESULTS_PER_PAGE));
  usp.set("locale", locale);
  usp.set("sort", activeTab === CourseTab.ON_DEMAND ? "date" : "nextSession");
  usp.append("themes", LEARN_FRENCH_THEME_ID);

  if (search) usp.set("search", search);
  for (const department of filters.departments) usp.append("departments", department);
  for (const city of filters.cities) usp.append("cities", city);
  for (const level of filters.frenchLevel) usp.append("frenchLevel", level);
  for (const category of filters.categories) usp.append("needs", String(category));
  for (const publicOption of filters.publicFilter) usp.append("public", publicOption);

  if (activeTab === CourseTab.UPCOMING) usp.set("hasUpcomingSession", "true");
  if (activeTab === CourseTab.ON_DEMAND) usp.set("hasUpcomingSession", "false");

  return usp;
};

export const useCourseSearch = (
  filters: FiltersState,
  search: string,
  activeTab: CourseTabType,
  ready: boolean,
) => {
  const locale = useLocale();
  const [results, setResults] = useState<SimpleDispositif[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!ready) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);

    fetch(`/api/search?${buildSearchParams(filters, search, activeTab, 1, locale).toString()}`)
      .then((response) => response.json())
      .then((data: CourseSearchResponse) => {
        if (requestId !== requestIdRef.current) return;
        setResults(data.results);
        setTotal(data.total);
        setPage(data.page);
        setPageCount(data.pageCount);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }, [filters, search, activeTab, locale, ready]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const requestId = ++requestIdRef.current;
      const response = await fetch(
        `/api/search?${buildSearchParams(filters, search, activeTab, page + 1, locale).toString()}`,
      );
      const data: CourseSearchResponse = await response.json();
      if (requestId !== requestIdRef.current) return;
      setResults((previous) => [...previous, ...data.results]);
      setPage(data.page);
      setPageCount(data.pageCount);
    } finally {
      setLoadingMore(false);
    }
  };

  return { results, total, page, pageCount, loading, loadingMore, loadMore };
};
