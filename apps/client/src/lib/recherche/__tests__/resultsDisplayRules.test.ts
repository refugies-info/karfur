import { sortByDate, sortByTheme, sortByView } from "~/lib/recherche/sortContents";
import { getDisplayRule } from "../resultsDisplayRules";

describe("All Tab Rules", () => {
  it("it should return correct values when no filters are selected", () => {
    expect(getDisplayRule("all", [], "default")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", [], "view")).toEqual({
      display: true,
      sortFunction: sortByView,
    });
    expect(getDisplayRule("all", [], "date")).toEqual({
      display: true,
      sortFunction: sortByDate,
    });
    expect(getDisplayRule("all", [], "location")).toEqual({
      display: false,
    });
    expect(getDisplayRule("all", [], "theme")).toEqual({
      display: true,
      sortFunction: sortByTheme,
    });
    expect(getDisplayRule("all", [], "suggestions")).toEqual({
      display: false,
    });
  });
});
