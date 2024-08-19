import { SortOptions } from "data/searchFilters";
import get from "lodash/get";
import { GetDispositifsResponse } from "@refugies-info/api-types";

const sortOptionsValues = {
  "location": "metadatas.location",
  "date": "publishedAt",
  "view": "nbVues",
  "theme": "theme"
}

export const sortDispositifs = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse, sortOption: SortOptions, hasSearch: boolean) => {
  if (hasSearch) return 0; // if algolia search, do not sort and use algolia order
  let sortKey = sortOptionsValues[sortOption];
  let valA = get(dispA, sortKey);
  let valB = get(dispB, sortKey);
  if (sortKey === "metadatas.location") { // if location sort, first localized contents
    if ((Array.isArray(valA) && !Array.isArray(valB)) || (!!valA && !valB)) return -1
    if ((Array.isArray(valB) && !Array.isArray(valA)) || (!!valB && !valA)) return 1

    // if equal, use date as secondary sort
    sortKey = sortOptionsValues["date"];
    valA = get(dispA, sortKey);
    valB = get(dispB, sortKey);
  }

  if (!valA) return 1;
  if (!valB) return -1;
  return valA > valB ? -1 : valA < valB ? 1 : 0;
}
