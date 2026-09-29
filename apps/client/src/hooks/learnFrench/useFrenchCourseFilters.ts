import type { Id } from "@refugies-info/api-types";
import type { FrenchOptions, PublicOptions } from "data/searchFilters";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CourseTab,
  type CourseTab as CourseTabType,
  type FiltersState,
} from "~/components/Pages/learnFrench";
import type { CitySelection } from "~/components/Pages/recherche/LocationMenu/functions";

const EMPTY_FILTERS: FiltersState = {
  departments: [],
  cities: [],
  frenchLevel: [],
  categories: [],
  publicFilter: [],
};

const asStringArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const CITY_PARAM_SEPARATOR = "|";

const encodeCitySelection = (city: CitySelection): string =>
  `${city.name}${CITY_PARAM_SEPARATOR}${city.department}`;

const decodeCitySelection = (value: string): CitySelection => {
  const [name, department] = value.split(CITY_PARAM_SEPARATOR);
  return { name: name ?? "", department: department ?? "" };
};

const URL_SYNC_DEBOUNCE_MS = 400;

export const useFrenchCourseFilters = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CourseTabType>(CourseTab.UPCOMING);
  const [isReady, setIsReady] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!router.isReady || isReady) return;

    const query = router.query;
    setFilters({
      departments: asStringArray(query.departments),
      cities: asStringArray(query.cities).map(decodeCitySelection),
      frenchLevel: asStringArray(query.frenchLevel) as FrenchOptions[],
      categories: asStringArray(query.categories) as Id[],
      publicFilter: asStringArray(query.publicFilter) as PublicOptions[],
    });
    if (typeof query.search === "string") setSearch(query.search);
    if (
      typeof query.tab === "string" &&
      (Object.values(CourseTab) as string[]).includes(query.tab)
    ) {
      setActiveTab(query.tab as CourseTabType);
    }
    setIsReady(true);
  }, [router.isReady]);

  useEffect(() => {
    if (!isReady) return;

    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const query: Record<string, string | string[]> = {};
      if (filters.departments.length > 0) query.departments = filters.departments;
      if (filters.cities.length > 0) query.cities = filters.cities.map(encodeCitySelection);
      if (filters.frenchLevel.length > 0) query.frenchLevel = filters.frenchLevel;
      if (filters.categories.length > 0) query.categories = filters.categories.map(String);
      if (filters.publicFilter.length > 0) query.publicFilter = filters.publicFilter;
      if (search) query.search = search;
      if (activeTab !== CourseTab.UPCOMING) query.tab = activeTab;

      router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
        scroll: false,
      });
    }, URL_SYNC_DEBOUNCE_MS);

    return () => clearTimeout(syncTimeoutRef.current);
  }, [filters, search, activeTab, isReady]);

  return { filters, setFilters, search, setSearch, activeTab, setActiveTab, isReady };
};
