import type { SearchResponse } from "~/lib/search-helpers";
import type { SearchQuery } from "./searchResults.reducer";

const SEARCH_RESULTS_LIMIT = 24;

export const fetchSearchResults = async (
  query: SearchQuery,
  page: number,
  locale = "fr",
): Promise<SearchResponse> => {
  const usp = new URLSearchParams();
  usp.set("page", String(page));
  usp.set("limit", String(SEARCH_RESULTS_LIMIT));
  usp.set("locale", locale);

  if (query.search) usp.set("search", query.search);
  if (query.type !== "all") usp.set("type", query.type);
  if (query.sort !== "default") usp.set("sort", query.sort);

  for (const dep of query.departments) usp.append("departments", dep);
  for (const theme of query.themes) usp.append("themes", String(theme));
  for (const need of query.needs) usp.append("needs", String(need));
  for (const age of query.age) usp.append("age", age);
  for (const level of query.frenchLevel) usp.append("frenchLevel", level);
  for (const pub of query.public) usp.append("public", pub);
  for (const status of query.status) usp.append("status", status);
  for (const lang of query.language) usp.append("language", lang);

  const response = await fetch(`/api/search?${usp.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  return response.json();
};
