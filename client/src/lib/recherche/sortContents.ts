import { SortOptions } from "data/searchFilters";
import get from "lodash/get";
import { GetDispositifsResponse } from "api-types";

const sortOptionsValues = {
  "date": "publishedAt",
  "view": "nbVues",
  "theme": "theme"
}

export const sortDispositifs = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse, sortOption: SortOptions, hasSearch: boolean) => {
  if (hasSearch) return 0; // if algolia search, do not sort and use algolia order
  const sortKey = sortOptionsValues[sortOption];
  const valA = get(dispA, sortKey);
  const valB = get(dispB, sortKey);
  return valA > valB ? -1 : valA < valB ? 1 : 0;
}
