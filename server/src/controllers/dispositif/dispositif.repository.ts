import { IDispositif } from "../../types/interface";
import { Dispositif } from "../../schema/schemaDispositif";
import { ObjectId } from "mongoose";

export const getDispositifsFromDB = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find({}, needFields).populate("mainSponsor creatorId");

export const getDispositifArray = async (query: any) => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    contenu: 1,
    tags: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    avancement: 1,
    status: 1,
    nbMots: 1,
  };
  if (query["audienceAge.bottomValue"]) {
    var modifiedQuery = Object.assign({}, query);

    delete modifiedQuery["audienceAge.bottomValue"];

    delete modifiedQuery["audienceAge.topValue"];
    var newQuery = {
      $or: [
        query,
        {
          "variantes.bottomValue": query["audienceAge.bottomValue"],

          "variantes.topValue": query["audienceAge.topValue"],
          ...modifiedQuery,
        },
      ],
    };
    return await Dispositif.find(newQuery, neededFields).lean();
  }
  return await Dispositif.find(query, neededFields).lean();
};

export const updateDispositifInDB = async (
  dispositifId: ObjectId,
  modifiedDispositif:
    | { mainSponsor: ObjectId; status: string }
    | { status: string; publishedAt: number }
    | { status: string }
    | {
        adminComments: string;
        adminProgressionStatus: string;
        adminPercentageProgressionStatus: string;
      }
) =>
  await Dispositif.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif);

export const getActiveDispositifsFromDBWithoutPopulate = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find(
    { status: "Actif", typeContenu: "dispositif" },
    needFields
  );

export const getAllDispositifsFromDB = async () =>
  await Dispositif.find({}, { audienceAge: 1 });
