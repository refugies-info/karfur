import Structure from "../../schema/schemaStructure.js";
import { IStructure } from "../../types/interface.js";

export const getStructureFromDB = async (
  id: string,
  withDispositifsAssocies: boolean
): Promise<IStructure> => {
  if (withDispositifsAssocies) {
    return await Structure.findOne({ _id: id }).populate("dispositifsAssocies");
  }
  return await Structure.findOne({ _id: id });
};
