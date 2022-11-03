import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { SearchQuery, UrlSearchQuery } from "pages/recherche";
import { ObjectId } from "mongodb";

export const decodeQuery = (routerQuery: any): SearchQuery => {
  const {
    departments, needs, themes, ages, frenchLevels, language, sort, type, search
  } = routerQuery as UrlSearchQuery;

  let query: SearchQuery = {
    search: search || "",
    departmentsSelected: [],
    needsSelected: [],
    themesSelected: [],
    filterAge: [],
    filterFrenchLevel: [],
    filterLanguage: [],
    selectedSort: "date",
    selectedType: "all",
  }

  // Reinject filters value in search
  if (departments || needs || themes || ages || frenchLevels || language || sort || type || search) {
    if (departments) query.departmentsSelected = decodeURIComponent(departments as string).split(",");
    if (needs) query.needsSelected = decodeURIComponent(needs as string).split(",") as unknown as ObjectId[];
    if (themes) query.themesSelected = decodeURIComponent(themes as string).split(",") as unknown as ObjectId[];
    if (ages) query.filterAge = decodeURIComponent(ages as string).split(",") as AgeOptions[];
    if (frenchLevels) query.filterFrenchLevel = decodeURIComponent(frenchLevels as string).split(",") as FrenchOptions[];
    if (language) query.filterLanguage = decodeURIComponent(language as string).split(",");
    if (sort) query.selectedSort = decodeURIComponent(sort as string) as SortOptions;
    if (type) query.selectedType = decodeURIComponent(type as string) as TypeOptions;
    if (search) query.search = decodeURIComponent(search as string);
  }

  return query;
}
