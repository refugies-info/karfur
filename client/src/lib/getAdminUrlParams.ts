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
  const urlParams: AdminUrlParams = {  };

  if (tab) urlParams.tab = tab;
  if (filter) urlParams.filter = encodeURI(filter);
  if (selectedUserId) urlParams.userId = selectedUserId.toString();
  if (selectedDispositifId) urlParams.contentId = selectedDispositifId.toString();
  if (selectedStructureId) urlParams.structureId = selectedStructureId.toString();

  return new URLSearchParams(urlParams).toString();
}


export const getInitialFilters = (router: NextRouter, currentTab: TabQuery) => {
  if (router.query.tab !== currentTab) {
    return {
      filter: null,
      selectedUserId: null,
      selectedDispositifId: null,
      selectedStructureId: null,
    }
  }

  const filterQuery = router.query.filter ?
    decodeURI(router.query.filter as string) as FilterContentStatus | FilterUserStatus | FilterStructureStatus :
    undefined;

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
