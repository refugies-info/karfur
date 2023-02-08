import logger from "../../logger";
import { asyncForEach } from "../../libs/asyncForEach";
import { DispositifId, Structure, StructureId, StructureModel, UserId } from "src/typegoose";

export const getStructureFromDB = async (
  id: StructureId,
  withDispositifsAssocies: boolean,
  fields: "all" | Record<string, number>
): Promise<Structure> =>
  StructureModel.findOne({ _id: id }, fields === "all" ? {} : fields)
    .then((structure) =>
      withDispositifsAssocies
        ? structure.populate({
            path: "dispositifsAssocies",
            populate: { path: "theme secondaryThemes mainSponsor" }
          })
        : structure
    )
    .then((structure) => structure.toObject() as Structure)
    .catch((e) => {
      logger.error("[getStructureFromDB] error", e);
      throw e;
    });

export const getStructure = getStructureFromDB;

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
  logger.info("[getStructuresFromDB] start");
  if (!withDispositifsAssocies) {
    logger.info("[getStructuresFromDB] without dispositifs associes");
    return await StructureModel.find(query, neededFields);
  }
  logger.info("[getStructuresFromDB] with dispositifs associes");
  return await StructureModel.find(query, neededFields)
    .populate("dispositifsAssocies", "_id status")
    .populate("createur", "username email picture");
};

export const updateAssociatedDispositifsInStructure = async (dispositifId: DispositifId, structureId: StructureId) => {
  logger.info("[updateAssociatedDispositifsInStructure] updating", {
    dispositifId,
    structureId
  });

  // we add if not the case the dispositif to the correct structure
  await StructureModel.findByIdAndUpdate(
    { _id: structureId },
    { $addToSet: { dispositifsAssocies: dispositifId } },
    { new: true }
  );

  const structureArrayWithDispoAssocie = await StructureModel.find({
    dispositifsAssocies: dispositifId
  });

  // if one structure it is the correct one
  if (structureArrayWithDispoAssocie.length === 1) return;

  // if more than 1, we have to remove the dispo from the wrong structures
  await asyncForEach(structureArrayWithDispoAssocie, async (structure) => {
    if (structure._id.toString() === structureId.toString()) return;
    logger.info("[updateAssociatedDispositifsInStructure] remove dispositif associe from structure", {
      structure: structure._id,
      dispositifId
    });
    await StructureModel.findByIdAndUpdate(
      { _id: structure._id },
      { $pull: { dispositifsAssocies: dispositifId } },
      { new: true }
    );
    return;
  });

  logger.info("[updateAssociatedDispositifsInStructure] successfully updated structures");
  return;
};

export const createStructureInDB = (structure: Structure) => StructureModel.create(structure);

export const updateStructureInDB = async (structureId: StructureId, structure: Partial<Structure>) => {
  return StructureModel.findOneAndUpdate(
    {
      _id: structureId
    },
    structure,
    { upsert: true, new: true }
  );
};

export const updateStructureMember = async (
  membreId: UserId,
  structure: {
    _id: StructureId;
    $set?: Object;
    $pull?: Object;
    $addToSet?: Object;
  }
) =>
  await StructureModel.findOneAndUpdate(
    {
      _id: structure._id,
      ...(membreId && { "membres.userId": membreId })
    },
    structure,
    { upsert: true, new: true }
  );

export const removeMemberFromStructure = async (structureId: StructureId, userId: UserId) => {
  return StructureModel.findOneAndUpdate(
    { _id: structureId },
    {
      $pull: {
        membres: { userId: userId.toString() }
      }
    }
  );
};

export const getNbStructures = async () => {
  return StructureModel.countDocuments({ status: "Actif" });
};
