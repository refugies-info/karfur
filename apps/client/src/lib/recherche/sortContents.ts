import { GetDispositifsResponse, GetThemeResponse } from "@refugies-info/api-types";
import get from "lodash/get";
import { getTheme } from "~/lib/getTheme";
import { sortThemes } from "~/lib/sortThemes";

const sortOptionsValues = {
  date: "publishedAt",
  view: "nbVues",
};

const sortHelper = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse, sortOption: "date" | "view") => {
  let sortKey = sortOptionsValues[sortOption];
  let valA = get(dispA, sortKey);
  let valB = get(dispB, sortKey);

  if (!valA) return 1;
  if (!valB) return -1;
  return valA > valB ? -1 : valA < valB ? 1 : 0;
};

export const sortByDate = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortHelper(dispA, dispB, "date");

export const sortByView = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) =>
  sortHelper(dispA, dispB, "view");

export const sortByTheme = (
  dispA: GetDispositifsResponse,
  dispB: GetDispositifsResponse,
  themes: GetThemeResponse[],
) => {
  const themeIdA = get(dispA, "theme");
  const themeIdB = get(dispB, "theme");

  if (!themeIdA) return 1;
  if (!themeIdB) return -1;

  const themeA = getTheme(themeIdA, themes);
  const themeB = getTheme(themeIdB, themes);

  return sortThemes(themeA, themeB);
};

export const noSort = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) => 0;

export const sortByLocation = (dispA: GetDispositifsResponse, dispB: GetDispositifsResponse) => {
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
