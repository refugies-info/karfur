import { Id } from "api-types";
import { NextRouter } from "next/router";
import { ContentStatusType, StructureStatusType, UserStatusType } from "types/interface";

export type TabQuery = "contenus" | "structures" | "utilisateurs" | "divers" | "categories" | "widgets" | undefined;
type Status = ContentStatusType | StructureStatusType | UserStatusType;

type AdminUrlParams = {
  tab?: string
  filter?: string
  userId?: string
  contentId?: string
  structureId?: string
}

export const getAdminUrlParams = (
  tab: TabQuery,
  filter: Status,
  selectedUserId: string | Id | undefined | null,
  selectedDispositifId: string | Id | undefined | null,
  selectedStructureId: string | Id | undefined | null,
) => {
  const urlParams: AdminUrlParams = {};

  urlParams.tab = tab || "contenus";
  if (filter) urlParams.filter = encodeURI(filter);
  if (selectedUserId) urlParams.userId = selectedUserId.toString();
  if (selectedDispositifId) urlParams.contentId = selectedDispositifId.toString();
  if (selectedStructureId) urlParams.structureId = selectedStructureId.toString();

  return new URLSearchParams(urlParams).toString();
}

// local storage queries
const ADMIN_URL_PARAMS = "adminUrlParams"
const getSavedQuery = () => {
  const savedQuery = localStorage.getItem(ADMIN_URL_PARAMS);
  return savedQuery ? new URLSearchParams(savedQuery) : null;
}

export const setSavedQuery = (query: string) => {
  localStorage.setItem(ADMIN_URL_PARAMS, query);
}

/**
 * Get initial tab of admin
 * Option 1: query
 * Option 2: localStorage
 * Option 3: default "contenus"
 * @param router
 * @returns
 */
export const getInitialTab = (router: NextRouter) => {
  if (router.query.tab) return router.query.tab as TabQuery; // option 1: url

  return getSavedQuery()?.get("tab") as TabQuery  // option 2: url
    || "contenus"; // option 3: contenus
}


const DEFAULT_FILTERS = {
  filter: null,
  selectedUserId: null,
  selectedDispositifId: null,
  selectedStructureId: null,
}

/**
 * Get initial filters of tab if active
 * Option 1: query
 * Option 2: localStorage
 * @param router
 * @param currentTab
 * @returns
 */
export const getInitialFilters = (router: NextRouter, currentTab: TabQuery) => {

  // Option 1: query of route
  if (router.query.tab) {
    if (router.query.tab !== currentTab) return DEFAULT_FILTERS

    const filterQuery = router.query.filter ?
      decodeURI(router.query.filter as string) as Status : undefined;

    return {
      filter: filterQuery,
      selectedUserId: router.query.userId as Id || null,
      selectedDispositifId: router.query.contentId as Id || null,
      selectedStructureId: router.query.structureId as Id || null,
    }
  }

  // Option 2: query of localStorage
  const savedQuery = getSavedQuery();
  if (savedQuery) {
    const initialTab = savedQuery.get("tab");

    if (initialTab && initialTab === currentTab) {
      const filterQuery = savedQuery.get("filter") ?
        decodeURI(savedQuery.get("filter") as string) as Status : undefined;

      return {
        filter: filterQuery,
        selectedUserId: savedQuery.get("userId") as Id || null,
        selectedDispositifId: savedQuery.get("contentId") as Id || null,
        selectedStructureId: savedQuery.get("structureId") as Id || null,
      }
    }
    return DEFAULT_FILTERS;
  }

  return DEFAULT_FILTERS;
}
