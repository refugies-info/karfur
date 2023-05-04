import { GetDispositifsResponse, Id } from "api-types";

export const areDispositifsAssociesPopulate = (
  toBeDetermined: GetDispositifsResponse[] | Id[]
): toBeDetermined is GetDispositifsResponse[] => {
  if (toBeDetermined && !toBeDetermined[0]) return true;
  if (toBeDetermined && (toBeDetermined as GetDispositifsResponse[])[0].status) {
    return true;
  }
  return false;
};
