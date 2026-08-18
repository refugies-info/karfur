import type { GetThemeResponse, Id } from "@refugies-info/api-types";
import type {
  AgeOptions,
  FrenchOptions,
  PublicOptions,
  SortOptions,
  StatusOptions,
  TypeOptions,
} from "data/searchFilters";
import type { UrlSearchQuery } from "~/pages/recherche";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import { backwardCompatibility } from "./decodeUrlQuery.compatibility";
import { asString } from "./queryParam";

const typeOptions: TypeOptions[] = ["all", "demarche", "dispositif", "ressource"];
const sortValues: SortOptions[] = ["default", "date", "views", "theme", "location"];

export const decodeQuery = (
  routerQuery: any,
  allThemes: GetThemeResponse[], // for backward compatibility
): SearchQuery => {
  const {
    departments,
    cities,
    needs,
    themes,
    age,
    frenchLevel,
    language,
    sort,
    type,
    search,
    status,
  } = routerQuery as UrlSearchQuery;

  let query: SearchQuery = {
    search: asString(search),
    departments: [],
    cities: [],
    needs: [],
    themes: [],
    age: [],
    frenchLevel: [],
    language: [],
    public: [],
    status: [],
    sort: "default",
    type: "all",
  };

  query = backwardCompatibility(routerQuery, query, allThemes);

  // Reinject filters value in search
  if (
    departments ||
    cities ||
    needs ||
    themes ||
    age ||
    frenchLevel ||
    routerQuery.public ||
    status ||
    language ||
    sort ||
    type ||
    search
  ) {
    if (departments) query.departments = asString(departments).split(",");
    if (cities) query.cities = asString(cities).split(",");
    if (needs) query.needs = asString(needs.toString()).split(",") as unknown as Id[];
    if (themes) query.themes = asString(themes.toString()).split(",") as unknown as Id[];
    if (age && query.age.length === 0) query.age = asString(age).split(",") as AgeOptions[];
    if (frenchLevel) query.frenchLevel = asString(frenchLevel).split(",") as FrenchOptions[];
    if (routerQuery.public)
      query.public = asString(routerQuery.public).split(",") as PublicOptions[];
    if (status) query.status = asString(status).split(",") as StatusOptions[];
    if (language) query.language = asString(language).split(",");
    if (sort) {
      const rawSort = asString(sort);
      const normalizedSort = (rawSort === "view" ? "views" : rawSort) as SortOptions;
      // Unknown values (bots, stale links) must not leak into the filters
      if (sortValues.includes(normalizedSort)) query.sort = normalizedSort;
    }
    if (type) {
      const rawType = asString(type) as TypeOptions;
      if (typeOptions.includes(rawType)) query.type = rawType;
    }
    if (search) query.search = asString(search);
  }

  return query;
};
