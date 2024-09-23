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
  return 0;
};
