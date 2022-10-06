import { SortOptions } from "data/searchFilters";
import { SearchDispositif } from "types/interface";
import get from "lodash/get";

const sortOptionsValues = {
  "date": "publishedAt",
  "view": "nbVues",
  "theme": "theme.position"
}

export const sortDispositifs = (dispA: SearchDispositif, dispB: SearchDispositif, sortOption: SortOptions, hasSearch: boolean) => {
  if (hasSearch) return 0; // if algolia search, do not sort and use algolia order
  const sortKey = sortOptionsValues[sortOption];
  const valA = get(dispA, sortKey);
  const valB = get(dispB, sortKey);
  return valA > valB ? -1 : valA < valB ? 1 : 0;
}
