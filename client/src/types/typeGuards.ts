import { SearchDispositif } from "./interface";
import { ObjectId } from "mongodb";

export const areDispositifsAssociesPopulate = (
  toBeDetermined: SearchDispositif[] | ObjectId[]
): toBeDetermined is SearchDispositif[] => {
  if (toBeDetermined && !toBeDetermined[0]) return true;
  if (toBeDetermined && (toBeDetermined as SearchDispositif[])[0].status) {
    return true;
  }
  return false;
};
