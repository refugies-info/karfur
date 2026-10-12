import type { SimpleDispositif } from "@refugies-info/api-types";
import type { CourseTab as CourseTabType, FiltersState } from "~/components/Pages/learnFrench";
import useLocale from "~/hooks/useLocale";
import { usePaginatedResults } from "~/hooks/usePaginatedResults";
import {
  type CourseSearchParams,
  type CourseSearchResponse,
  fetchCourseSearchPage,
} from "~/services/FrenchCourseSearch/frenchCourseSearch.service";

export const RESULTS_PER_PAGE = 10;

export const useCourseSearch = (
  filters: FiltersState,
  search: string,
  activeTab: CourseTabType,
  ready: boolean,
  limit: number = RESULTS_PER_PAGE,
) => {
  const locale = useLocale();

  return usePaginatedResults<CourseSearchParams, SimpleDispositif, CourseSearchResponse>({
    cacheKey: "french-course-search",
    params: ready ? { filters, search, activeTab, locale, limit } : null,
    fetchPage: fetchCourseSearchPage,
    logLabel: "[useCourseSearch]",
  });
};
