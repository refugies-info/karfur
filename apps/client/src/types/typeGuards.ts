import type { GetDispositifsResponse, Id, SimpleDispositif } from "@refugies-info/api-types";

export const areDispositifsAssociesPopulate = (
  toBeDetermined: SimpleDispositif[] | Id[],
): toBeDetermined is GetDispositifsResponse[] => {
  if (toBeDetermined && !toBeDetermined[0]) return true;
  if (toBeDetermined && (toBeDetermined as SimpleDispositif[])[0].status) {
    return true;
  }
  return false;
};
