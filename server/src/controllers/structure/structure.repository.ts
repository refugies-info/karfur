import Structure from "../../schema/schemaStructure.js";
import { IStructure } from "../../types/interface";

export const getStructureFromDB = async (
  id: string,
  withDispositifsAssocies: boolean,
  fields: "all" | Record<string, number>
): Promise<IStructure> => {
  if (withDispositifsAssocies) {
    if (fields === "all") {
      return await Structure.findOne({ _id: id }).populate(
        "dispositifsAssocies"
      );
    }
    return await Structure.findOne({ _id: id }, fields).populate(
      "dispositifsAssocies"
    );
  }
  if (fields === "all") {
    return await Structure.findOne({ _id: id });
  }
  return await Structure.findOne({ _id: id }, fields);
};

export const getStructuresFromDB = async (): Promise<IStructure> =>
  await Structure.find(
    { status: "Actif" },
    { nom: 1, acronyme: 1, picture: 1 }
  );
