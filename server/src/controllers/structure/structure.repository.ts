import { Structure, StructureDoc } from "../../schema/schemaStructure";
import { ObjectId } from "mongoose";

export const getStructureFromDB = async (
  id: ObjectId,
  withDispositifsAssocies: boolean,
  fields: "all" | Record<string, number>
): Promise<StructureDoc> => {
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

export const getStructuresFromDB = async () =>
  await Structure.find(
    { status: "Actif" },
    { nom: 1, acronyme: 1, picture: 1 }
  );
