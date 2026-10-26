import { renderHook } from "@testing-library/react";
import { CourseTab, type FiltersState } from "~/components/Pages/learnFrench";
import { useAutoSwitchToOnDemandTab } from "./useAutoSwitchToOnDemandTab";

const NO_FILTERS: FiltersState = {
  departments: [],
  cities: [],
  frenchLevel: [],
  categories: [],
  publicFilter: [],
};

const PARIS: FiltersState = { ...NO_FILTERS, departments: ["75"] };

const baseParams = {
  filters: PARIS,
  activeTab: CourseTab.UPCOMING,
  total: 0,
  isSettled: true,
  hasError: false,
};

describe("useAutoSwitchToOnDemandTab", () => {
  it("switches to the on demand tab when a location has no upcoming course", () => {
    const setActiveTab = jest.fn();
    renderHook(() => useAutoSwitchToOnDemandTab({ ...baseParams, setActiveTab }));

    expect(setActiveTab).toHaveBeenCalledWith(CourseTab.ON_DEMAND);
  });

  it("does not switch while the search is not settled", () => {
    const setActiveTab = jest.fn();
    renderHook(() => useAutoSwitchToOnDemandTab({ ...baseParams, isSettled: false, setActiveTab }));

    expect(setActiveTab).not.toHaveBeenCalled();
  });

  it("does not switch when the search failed", () => {
    const setActiveTab = jest.fn();
    renderHook(() => useAutoSwitchToOnDemandTab({ ...baseParams, hasError: true, setActiveTab }));

    expect(setActiveTab).not.toHaveBeenCalled();
  });

  it("does not switch when there are results, no location, or another tab is active", () => {
    const setActiveTab = jest.fn();
    renderHook(() => useAutoSwitchToOnDemandTab({ ...baseParams, total: 3, setActiveTab }));
    renderHook(() =>
      useAutoSwitchToOnDemandTab({ ...baseParams, filters: NO_FILTERS, setActiveTab }),
    );
    renderHook(() =>
      useAutoSwitchToOnDemandTab({ ...baseParams, activeTab: CourseTab.ON_DEMAND, setActiveTab }),
    );

    expect(setActiveTab).not.toHaveBeenCalled();
  });

  it("switches only once for the same location", () => {
    const setActiveTab = jest.fn();
    const { rerender } = renderHook((props) => useAutoSwitchToOnDemandTab(props), {
      initialProps: { ...baseParams, setActiveTab },
    });

    rerender({ ...baseParams, isSettled: false, setActiveTab });
    rerender({ ...baseParams, isSettled: true, setActiveTab });

    expect(setActiveTab).toHaveBeenCalledTimes(1);
  });
});
