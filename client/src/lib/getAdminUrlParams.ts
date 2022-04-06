import { ObjectId } from "mongodb";
import { NextRouter } from "next/router";
import { FilterContentStatus } from "containers/Backend/Admin/AdminContenu/data";
import { FilterUserStatus } from "containers/Backend/Admin/AdminUsers/data";
import { FilterStructureStatus } from "containers/Backend/Admin/AdminStructures/data";

export type TabQuery = "contenus" | "structures" | "utilisateurs" | "statistiques" | "besoins" | undefined;
type Status = FilterContentStatus | FilterStructureStatus | FilterUserStatus;

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
  selectedUserId: string | ObjectId | undefined | null,
  selectedDispositifId: string | ObjectId | undefined | null,
  selectedStructureId: string | ObjectId | undefined | null,
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
      //@ts-ignore
      selectedUserId: router.query.userId as ObjectId || null,
      //@ts-ignore
      selectedDispositifId: router.query.contentId as ObjectId || null,
      //@ts-ignore
      selectedStructureId: router.query.structureId as ObjectId || null,
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
        //@ts-ignore
        selectedUserId: savedQuery.get("userId") as ObjectId || null,
        //@ts-ignore
        selectedDispositifId: savedQuery.get("contentId") as ObjectId || null,
        //@ts-ignore
        selectedStructureId: savedQuery.get("structureId") as ObjectId || null,
      }
    }
    return DEFAULT_FILTERS;
  }

  return DEFAULT_FILTERS;
}
