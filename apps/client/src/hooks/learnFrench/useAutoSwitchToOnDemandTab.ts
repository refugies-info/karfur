import { useEffect, useRef } from "react";
import {
  CourseTab,
  type CourseTab as CourseTabType,
  type FiltersState,
} from "~/components/Pages/learnFrench";

interface Params {
  filters: FiltersState;
  activeTab: CourseTabType;
  setActiveTab: (tab: CourseTabType) => void;
  total: number;
  isSettled: boolean;
}

export const useAutoSwitchToOnDemandTab = (params: Params) => {
  const { filters, activeTab, setActiveTab, total, isSettled } = params;
  const switchedForLocationRef = useRef<string | null>(null);

  const hasLocation = filters.departments.length > 0 || filters.cities.length > 0;
  const locationKey = JSON.stringify([filters.departments, filters.cities]);

  useEffect(() => {
    switchedForLocationRef.current = null;
  }, [locationKey]);

  useEffect(() => {
    if (!isSettled || !hasLocation || activeTab !== CourseTab.UPCOMING || total > 0) return;
    if (switchedForLocationRef.current === locationKey) return;

    switchedForLocationRef.current = locationKey;
    setActiveTab(CourseTab.ON_DEMAND);
  }, [isSettled, hasLocation, activeTab, total, locationKey, setActiveTab]);
};
