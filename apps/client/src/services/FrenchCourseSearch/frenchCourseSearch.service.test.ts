import { CourseTab, type FiltersState } from "~/components/Pages/learnFrench";
import { LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import {
  buildSearchParams,
  type CourseSearchParams,
  fetchCourseSearchPage,
} from "./frenchCourseSearch.service";

const EMPTY_FILTERS: FiltersState = {
  departments: [],
  cities: [],
  frenchLevel: [],
  categories: [],
  publicFilter: [],
};

const buildParams = (overrides: Partial<CourseSearchParams> = {}): CourseSearchParams => ({
  filters: EMPTY_FILTERS,
  search: "",
  activeTab: CourseTab.UPCOMING,
  locale: "fr",
  limit: 10,
  ...overrides,
});

describe("buildSearchParams", () => {
  it("always targets the learn French theme with the page, limit and locale", () => {
    const usp = buildSearchParams(buildParams({ locale: "ar", limit: 24 }), 3);

    expect(usp.get("page")).toBe("3");
    expect(usp.get("limit")).toBe("24");
    expect(usp.get("locale")).toBe("ar");
    expect(usp.getAll("themes")).toEqual([LEARN_FRENCH_THEME_ID]);
    expect(usp.get("sort")).toBe("nextSession");
  });

  it("only sends the search term when there is one", () => {
    expect(buildSearchParams(buildParams(), 1).has("search")).toBe(false);
    expect(buildSearchParams(buildParams({ search: "apprendre" }), 1).get("search")).toBe(
      "apprendre",
    );
  });

  it("adds the department of each selected city once, next to the cities themselves", () => {
    const usp = buildSearchParams(
      buildParams({
        filters: {
          ...EMPTY_FILTERS,
          departments: ["75"],
          cities: [
            { name: "Paris", department: "75" },
            { name: "Lyon", department: "69" },
          ],
        },
      }),
      1,
    );

    expect(usp.getAll("departments")).toEqual(["75", "69"]);
    expect(usp.getAll("nearCity")).toEqual(["Paris", "Lyon"]);
  });

  it("maps the tab to the upcoming session filter", () => {
    expect(
      buildSearchParams(buildParams({ activeTab: CourseTab.UPCOMING }), 1).get(
        "hasUpcomingSession",
      ),
    ).toBe("true");
    expect(
      buildSearchParams(buildParams({ activeTab: CourseTab.ON_DEMAND }), 1).get(
        "hasUpcomingSession",
      ),
    ).toBe("false");
  });
});

describe("fetchCourseSearchPage", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("calls /api/search with the built query and returns the JSON body", async () => {
    const body = { results: [], total: 0, page: 1, pageCount: 0 };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => body });

    await expect(fetchCourseSearchPage(buildParams({ search: "fle" }), 2)).resolves.toEqual(body);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl.startsWith("/api/search?")).toBe(true);
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("search=fle");
  });

  it("throws when the API does not answer with a success status", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(fetchCourseSearchPage(buildParams(), 1)).rejects.toThrow(
      "/api/search responded 500",
    );
  });
});
