import { GetDispositifsResponse } from "@refugies-info/api-types";
import { SortOptions } from "data/searchFilters";
import get from "lodash/get";

const sortOptionsValues = {
  location: "metadatas.location",
  date: "publishedAt",
  view: "nbVues",
  theme: "theme",
};

const sortDispositifs = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse, sortOption: SortOptions) => {
  let sortKey = sortOptionsValues[sortOption];
  let valA = get(dispA, sortKey);
  let valB = get(dispB, sortKey);
  if (sortKey === "metadatas.location") {
    // if location sort, first localized contents
    if ((Array.isArray(valA) && !Array.isArray(valB)) || (!!valA && !valB)) return -1;
    if ((Array.isArray(valB) && !Array.isArray(valA)) || (!!valB && !valA)) return 1;

    // if equal, use date as secondary sort
    sortKey = sortOptionsValues["date"];
    valA = get(dispA, sortKey);
    valB = get(dispB, sortKey);
  }

  if (!valA) return 1;
  if (!valB) return -1;
  return valA > valB ? -1 : valA < valB ? 1 : 0;
};

export const sortByLocation = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortDispositifs(dispA, dispB, "location");

export const sortByDate = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortDispositifs(dispA, dispB, "date");

export const sortByView = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortDispositifs(dispA, dispB, "view");

export const sortByTheme = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortDispositifs(dispA, dispB, "theme");

export const noSort = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) => 0;

export const sortByViewFirstLocalThenFrance = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) => {
  // TODO: First local contents, then french contents sort each section by view
  const locationA = get(dispA, "metadatas.location");
  const locationB = get(dispB, "metadatas.location");

  // First, sort by location
  if ((Array.isArray(locationA) && !Array.isArray(locationB)) || (!!locationA && !locationB)) return -1;
  if ((Array.isArray(locationB) && !Array.isArray(locationA)) || (!!locationB && !locationA)) return 1;

  // If locations are of the same type, sort by views
  if (
    (Array.isArray(locationA) && Array.isArray(locationB)) ||
    (!Array.isArray(locationA) && !Array.isArray(locationB))
  ) {
    const viewsA = get(dispA, "nbVues");
    const viewsB = get(dispB, "nbVues");

    if (!viewsA) return 1;
    if (!viewsB) return -1;
    return viewsA > viewsB ? -1 : viewsA < viewsB ? 1 : 0;
  }

  // If we reach here, locations are considered equal
  return 0;
};
