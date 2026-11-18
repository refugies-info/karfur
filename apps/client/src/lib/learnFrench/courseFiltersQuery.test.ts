import { mergeCourseFiltersQuery } from "./courseFiltersQuery";

describe("mergeCourseFiltersQuery", () => {
  it("keeps the params that are not filters", () => {
    const query = mergeCourseFiltersQuery(
      { utm_source: "partenaire", utm_campaign: "com-nov26", utm_medium: "mail" },
      { search: "cours" },
    );

    expect(query).toEqual({
      utm_source: "partenaire",
      utm_campaign: "com-nov26",
      utm_medium: "mail",
      search: "cours",
    });
  });

  it("removes the filters that are no longer set", () => {
    const query = mergeCourseFiltersQuery(
      { utm_source: "partenaire", departments: ["75"], tab: "onDemand", search: "cours" },
      { search: "cours" },
    );

    expect(query).toEqual({ utm_source: "partenaire", search: "cours" });
  });

  it("replaces the current value of a filter", () => {
    expect(mergeCourseFiltersQuery({ departments: ["75"] }, { departments: ["21"] })).toEqual({
      departments: ["21"],
    });
  });

  it("ignores undefined params", () => {
    expect(mergeCourseFiltersQuery({ utm_source: undefined }, {})).toEqual({});
  });
});
