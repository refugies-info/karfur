import { IDispositif } from "./interface";
import { ObjectId } from "mongodb";

export const areDispositifsAssociesPopulate = (
  toBeDetermined: IDispositif[] | ObjectId[]
): toBeDetermined is IDispositif[] => {
  if (!toBeDetermined[0]) return true;
  if ((toBeDetermined as IDispositif[])[0].status) {
    return true;
  }
  return false;
};
