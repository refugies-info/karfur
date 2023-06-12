import logger from "../../logger";
import { Structure, StructureId, StructureModel, UserId } from "../../typegoose";
import { FilterQuery, ProjectionFields } from "mongoose";
import { Id, Metadatas, Picture } from "@refugies-info/api-types";

export const getStructureFromDB = async (
  id: StructureId,
  fields: "all" | Record<string, number>,
): Promise<Structure> =>
  StructureModel.findOne({ _id: id }, fields === "all" ? {} : fields)
    .then((structure) => structure.toObject() as Structure)
    .catch((e) => {
      logger.error("[getStructureFromDB] error", e);
      throw e;
    });

export const getStructureById = (id: string) => StructureModel.findOne({ _id: id });

export const getStructuresFromDB = async (query: FilterQuery<Structure>, neededFields: ProjectionFields<Structure>) => {
  logger.info("[getStructuresFromDB] without dispositifs associes");
  return StructureModel.find(query, neededFields);
};

type PopulatedDispositif = {
  _id: Id;
  status: string;
  metadatas: Metadatas
}

type PopulatedCreateur = {
  _id: Id;
  username: string;
  email: string;
  picture: Picture | null;
}

type StructureWithDispos = Omit<Structure, "createur"> & {
  dispositifsAssocies: PopulatedDispositif[];
  createur: PopulatedCreateur[];
}

export const getStructuresWithDispos = async (
  query: FilterQuery<Structure>,
  neededFields: ProjectionFields<Structure>,
): Promise<StructureWithDispos[]> => {
  logger.info("[getStructuresWithDispos] with dispositifs associes");
  return StructureModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "dispositifs",
        localField: "_id",
        foreignField: "mainSponsor",
        as: "dispositifsAssocies"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "createur",
        foreignField: "_id",
        as: "createur"
      }
    },
    {
      $project: {
        ...neededFields,
        dispositifsAssocies: {
          _id: 1,
          status: 1,
          metadatas: 1
        },
        createur: {
          _id: 1,
          username: 1,
          email: 1,
          picture: 1,
        }
      }
    }
  ])
};

export const createStructureInDB = (structure: Partial<Structure>) => StructureModel.create(structure);

export const updateStructureInDB = async (structureId: StructureId, structure: Partial<Structure>) => {
  return StructureModel.findOneAndUpdate(
    {
      _id: structureId,
    },
    structure,
    { upsert: true, new: true },
  );
};

export const updateStructureMember = async (
  membreId: UserId,
  structure: {
    _id: StructureId;
    $set?: Object;
    $pull?: Object;
    $addToSet?: Object;
  },
) =>
  await StructureModel.findOneAndUpdate(
    {
      _id: structure._id,
      ...(membreId && { "membres.userId": membreId }),
    },
    structure,
    { upsert: true, new: true },
  );

export const removeMemberFromStructure = async (structureId: StructureId, userId: UserId) => {
  return StructureModel.findOneAndUpdate(
    { _id: structureId },
    {
      $pull: {
        membres: { userId: userId.toString() },
      },
    },
  );
};

export const getNbStructures = async () => {
  return StructureModel.countDocuments({ status: "Actif" });
};

export const getStructureName = async (
  id: Id,
) => StructureModel.findById(id, { "nom": 1 })
  .then(res => res?.nom)
