import type { SimpleDispositif } from "@refugies-info/api-types";
import {
  CourseTab,
  type CourseTab as CourseTabType,
  type FiltersState,
} from "~/components/Pages/learnFrench";
import { LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import type { PaginatedResponse } from "~/hooks/usePaginatedResults";

export const COURSE_SEARCH_CACHE_KEY = "french-course-search";

export type CourseSearchResponse = PaginatedResponse<SimpleDispositif>;

export interface CourseSearchParams {
  filters: FiltersState;
  search: string;
  activeTab: CourseTabType;
  locale: string;
  limit: number;
}

export const buildSearchParams = (
  { filters, search, activeTab, locale, limit }: CourseSearchParams,
  page: number,
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  searchParams.set("locale", locale);
  searchParams.set("sort", "nextSession");
  searchParams.set("strictNeeds", "true");
  searchParams.set("includeSecondaryThemes", "true");
  searchParams.append("themes", LEARN_FRENCH_THEME_ID);

  if (search) searchParams.set("search", search);
  const departments = new Set(filters.departments);
  for (const city of filters.cities) departments.add(city.department);
  for (const department of departments) searchParams.append("departments", department);
  for (const city of filters.cities) searchParams.append("nearCity", city.name);
  for (const level of filters.frenchLevel) searchParams.append("frenchLevel", level);
  for (const category of filters.categories) searchParams.append("needs", String(category));
  for (const publicOption of filters.publicFilter) searchParams.append("public", publicOption);

  if (activeTab === CourseTab.UPCOMING) searchParams.set("hasUpcomingSession", "true");
  if (activeTab === CourseTab.ON_DEMAND) searchParams.set("hasUpcomingSession", "false");

  return searchParams;
};

export const fetchCourseSearchPage = async (
  params: CourseSearchParams,
  page: number,
): Promise<CourseSearchResponse> => {
  const response = await fetch(`/api/search?${buildSearchParams(params, page).toString()}`);
  if (!response.ok) throw new Error(`/api/search responded ${response.status}`);
  return response.json();
};
