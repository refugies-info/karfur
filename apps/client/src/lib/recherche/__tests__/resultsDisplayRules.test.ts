import {
  noSort,
  sortByDate,
  sortByLocation,
  sortByTheme,
  sortByView,
  sortByViewFirstLocalThenFrance,
} from "~/lib/recherche/sortContents";
import { FilterKey, getDisplayRule, TabKey } from "../resultsDisplayRules";

describe("All Tab Rules", () => {
  const tab: TabKey = "all";
  it("it should return correct values when no filters are set", () => {
    const filters: FilterKey[] = [];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the location filter is set", () => {
    const filters: FilterKey[] = ["location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the keywords filter is set", () => {
    const filters: FilterKey[] = ["keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme filter is set", () => {
    const filters: FilterKey[] = ["theme"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the location and keywords filters are set", () => {
    const filters: FilterKey[] = ["location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and location filters are set", () => {
    const filters: FilterKey[] = ["theme", "location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the theme, location and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
});

describe("Dispositif Tab Rules", () => {
  const tab: TabKey = "dispositif";
  it("it should return correct values when no filters are set", () => {
    const filters: FilterKey[] = [];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the location filter is set", () => {
    const filters: FilterKey[] = ["location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the keywords filter is set", () => {
    const filters: FilterKey[] = ["keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme filter is set", () => {
    const filters: FilterKey[] = ["theme"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the location and keywords filters are set", () => {
    const filters: FilterKey[] = ["location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and location filters are set", () => {
    const filters: FilterKey[] = ["theme", "location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the theme, location and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
});

describe("Démarche Tab Rules", () => {
  const tab: TabKey = "demarche";
  it("it should return correct values when no filters are set", () => {
    const filters: FilterKey[] = [];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the location filter is set", () => {
    const filters: FilterKey[] = ["location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the keywords filter is set", () => {
    const filters: FilterKey[] = ["keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme filter is set", () => {
    const filters: FilterKey[] = ["theme"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the location and keywords filters are set", () => {
    const filters: FilterKey[] = ["location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and location filters are set", () => {
    const filters: FilterKey[] = ["theme", "location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the theme, location and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
});

describe("Démarche Tab Rules", () => {
  const tab: TabKey = "demarche";
  it("it should return correct values when no filters are set", () => {
    const filters: FilterKey[] = [];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the location filter is set", () => {
    const filters: FilterKey[] = ["location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the keywords filter is set", () => {
    const filters: FilterKey[] = ["keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme filter is set", () => {
    const filters: FilterKey[] = ["theme"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the location and keywords filters are set", () => {
    const filters: FilterKey[] = ["location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and location filters are set", () => {
    const filters: FilterKey[] = ["theme", "location"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the theme, location and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "location", "keywords"];
    expect(getDisplayRule(tab, filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule(tab, filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule(tab, filters, "suggestions")).toEqual({
      display: false,
    });
  });
});
