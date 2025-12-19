import type { SimpleDispositif } from "@refugies-info/api-types";
import get from "lodash/get";

const sortOptionsValues = {
  date: "publishedAt",
  view: "nbVues",
};

const sortHelper = (
  dispA: SimpleDispositif,
  dispB: SimpleDispositif,
  sortOption: "date" | "view",
) => {
  const sortKey = sortOptionsValues[sortOption];
  const valA = get(dispA, sortKey);
  const valB = get(dispB, sortKey);

  if (!valA) return 1;
  if (!valB) return -1;
  return valA > valB ? -1 : valA < valB ? 1 : 0;
};

export const sortByDate = (dispA: SimpleDispositif, dispB: SimpleDispositif) =>
  sortHelper(dispA, dispB, "date");

export const sortByView = (dispA: SimpleDispositif, dispB: SimpleDispositif) =>
  sortHelper(dispA, dispB, "view");

export const sortByTheme = (dispA: SimpleDispositif, dispB: SimpleDispositif) => {
  const valA = get(dispA, "themeSortIndex");
  const valB = get(dispB, "themeSortIndex");

  if (!valA) return 1;
  if (!valB) return -1;

  return valA > valB ? 1 : -1;
};

export const noSort = (dispA: SimpleDispositif, dispB: SimpleDispositif) => 0;

export const sortByLocation = (dispA: SimpleDispositif, dispB: SimpleDispositif) => {
  // TODO: First local contents, then french contents sort each section by view
  const locationA = get(dispA, "metadatas.location");
  const locationB = get(dispB, "metadatas.location");

  // First, sort by location
  if ((Array.isArray(locationA) && !Array.isArray(locationB)) || (!!locationA && !locationB))
    return -1;
  if ((Array.isArray(locationB) && !Array.isArray(locationA)) || (!!locationB && !locationA))
    return 1;

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
