import { Structure, StructureDoc } from "../../schema/schemaStructure";
import { ObjectId } from "mongoose";
import logger from "../../logger";
import { asyncForEach } from "../../libs/asyncForEach";

export const getStructureFromDB = async (
  id: ObjectId,
  withDispositifsAssocies: boolean,
  fields: "all" | Record<string, number>
): Promise<StructureDoc> => {
  try {
    if (withDispositifsAssocies) {
      if (fields === "all") {
        return await Structure.findOne({ _id: id }).populate({
          path: "dispositifsAssocies",
          populate: { path: "theme secondaryThemes mainSponsor" }
        });
      }
      return await Structure.findOne({ _id: id }, fields).populate({
        path: "dispositifsAssocies",
        populate: { path: "theme secondaryThemes mainSponsor" }
      });
    }
    if (fields === "all") {
      return await Structure.findOne({ _id: id });
    }
    return await Structure.findOne({ _id: id }, fields);
  } catch (e) {
    logger.error("[getStructureFromDB] error", e);
  }
};

type Query = { status: "Actif" } | {};
type NeededFields =
  | {
    nom: number;
    acronyme: number;
    picture: number;
    structureTypes: number;
    departments: number;
  }
  | {
    nom: number;
    acronyme: number;
    status: number;
    picture: number;
    createur: number;
    dispositifsAssocies: number;
    created_at: number;
    membres: number;
    adminComments: number;
    adminProgressionStatus: number;
    adminPercentageProgressionStatus: number;
  }
  | { membres: 1 };

export const getStructuresFromDB = async (
  query: Query,
  neededFields: NeededFields,
  withDispositifsAssocies: boolean
) => {
  if (!withDispositifsAssocies)
    return await Structure.find(query, neededFields);

  return await Structure.find(query, neededFields)
    .populate("dispositifsAssocies")
    .populate("createur", "username email picture");
};

export const updateAssociatedDispositifsInStructure = async (
  dispositifId: ObjectId,
  structureId: ObjectId
) => {
  logger.info("[updateAssociatedDispositifsInStructure] updating", {
    dispositifId,
    structureId,
  });

  // we add if not the case the dispositif to the correct structure
  await Structure.findByIdAndUpdate(
    { _id: structureId },
    { $addToSet: { dispositifsAssocies: dispositifId } },
    // @ts-ignore
    { new: true }
  );

  const structureArrayWithDispoAssocie = await Structure.find({
    dispositifsAssocies: dispositifId,
  });

  // if one structure it is the correct one
  if (structureArrayWithDispoAssocie.length === 1) return;

  // if more than 1, we have to remove the dispo from the wrong structures
  await asyncForEach(structureArrayWithDispoAssocie, async (structure) => {
    if (structure._id.toString() === structureId.toString()) return;
    logger.info(
      "[updateAssociatedDispositifsInStructure] remove dispositif associe from structure",
      { structure: structure._id, dispositifId }
    );
    await Structure.findByIdAndUpdate(
      { _id: structure._id },
      { $pull: { dispositifsAssocies: dispositifId } },
      // @ts-ignore
      { new: true }
    );
    return;
  });

  logger.info(
    "[updateAssociatedDispositifsInStructure] successfully updated structures"
  );
  return;
};

export const createStructureInDB = async (structure: StructureDoc) =>
  await new Structure(structure).save();

export const updateStructureInDB = async (
  structureId: ObjectId,
  structure: Partial<StructureDoc>
) => {
  return Structure.findOneAndUpdate(
    {
      _id: structureId,
    },
    structure,
    // @ts-ignore
    { upsert: true, new: true }
  );
};

export const updateStructureMember = async (
  membreId: ObjectId,
  structure: {
    _id: ObjectId;
    $set?: Object;
    $pull?: Object;
    $addToSet?: Object;
  }
) =>
  await Structure.findOneAndUpdate(
    {
      _id: structure._id,
      ...(membreId && { "membres.userId": membreId }),
    },
    // @ts-ignore
    structure,
    { upsert: true, new: true }
  );

export const removeMemberFromStructure = async (
  structureId: ObjectId,
  userId: ObjectId
) => {
  return Structure.findOneAndUpdate(
    { _id: structureId },
    {
      $pull: {
        membres: { userId: userId.toString() }
      }
    }
  );
}
