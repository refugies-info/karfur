import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { UrlSearchQuery } from "pages/recherche";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { backwardCompatibility } from "./decodeUrlQuery.compatibility";
import { GetThemeResponse, Id } from "api-types";

export const decodeQuery = (
  routerQuery: any,
  allThemes: GetThemeResponse[] // for backward compatibility
): SearchQuery => {
  const {
    departments, needs, themes, age, frenchLevel, language, sort, type, search
  } = routerQuery as UrlSearchQuery;

  let query: SearchQuery = {
    search: search || "",
    departments: [],
    needs: [],
    themes: [],
    age: [],
    frenchLevel: [],
    language: [],
    sort: "date",
    type: "all",
  };

  query = backwardCompatibility(routerQuery, query, allThemes);

  // Reinject filters value in search
  if (departments || needs || themes || age || frenchLevel || language || sort || type || search) {
    if (departments) query.departments = decodeURIComponent(departments as string).split(",");
    if (needs) query.needs = decodeURIComponent(needs as string).split(",") as unknown as Id[];
    if (themes) query.themes = decodeURIComponent(themes as string).split(",") as unknown as Id[];
    if (age && query.age.length === 0) query.age = decodeURIComponent(age as string).split(",") as AgeOptions[];
    if (frenchLevel) query.frenchLevel = decodeURIComponent(frenchLevel as string).split(",") as FrenchOptions[];
    if (language) query.language = decodeURIComponent(language as string).split(",");
    if (sort) query.sort = decodeURIComponent(sort as string) as SortOptions;
    if (type) query.type = decodeURIComponent(type as string) as TypeOptions;
    if (search) query.search = decodeURIComponent(search as string);
  }

  return query;
}
