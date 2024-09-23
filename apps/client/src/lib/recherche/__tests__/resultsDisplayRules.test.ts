import {
  noSort,
  sortByDate,
  sortByLocation,
  sortByTheme,
  sortByView,
  sortByViewFirstLocalThenFrance,
} from "~/lib/recherche/sortContents";
import { FilterKey, getDisplayRule } from "../resultsDisplayRules";

describe("All Tab Rules", () => {
  it("it should return correct values when no filters are set", () => {
    const filters: FilterKey[] = [];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the location filter is set", () => {
    const filters: FilterKey[] = ["location"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the keywords filter is set", () => {
    const filters: FilterKey[] = ["keywords"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme filter is set", () => {
    const filters: FilterKey[] = ["theme"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the location and keywords filters are set", () => {
    const filters: FilterKey[] = ["location", "keywords"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "keywords"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
  it("it should return correct values when the theme and location filters are set", () => {
    const filters: FilterKey[] = ["theme", "location"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: sortByLocation,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: true,
      sortFunction: sortByViewFirstLocalThenFrance,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: true,
    });
  });
  it("it should return correct values when the theme, location and keywords filters are set", () => {
    const filters: FilterKey[] = ["theme", "location", "keywords"];
    expect(getDisplayRule("all", filters, "default")).toEqual({
      display: true,
      sortFunction: noSort,
    });
    expect(getDisplayRule("all", filters, "view")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "date")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "theme")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", filters, "suggestions")).toEqual({
      display: false,
    });
  });
});
