import { IDispositif, AudienceAge } from "../../types/interface";
import {
  Dispositif,
  DispositifPopulatedDoc,
  DispositifDoc,
} from "../../schema/schemaDispositif";
import { ObjectId } from "mongoose";

export const getDispositifsFromDB = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find({}, needFields).populate("mainSponsor creatorId");

export const getDispositifArray = async (query: any, extraFields: any = {}, populate: string = "") => {
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
    nbVues: 1,
    audienceAge: 1,
    niveauFrancais: 1,
    ...extraFields
  };

  return await Dispositif.find(query, neededFields).lean().populate(populate);
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
    | { audienceAge: AudienceAge[] }
    | { audienceAge: AudienceAge[]; contenu: any }
    | { nbVues: number }
    | { draftReminderMailSentDate: number }
    | { draftSecondReminderMailSentDate: number }
    | { lastReminderMailSentToUpdateContentDate: number }
    | { $pull: { [x: string]: { suggestionId: string } } }
    | { tags: any }
    | { needs: any }
    | { nbVuesMobile: number }
    | { nbFavoritesMobile: number }
) =>
  await Dispositif.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif, {
    upsert: true,
    // @ts-ignore
    new: true,
  });

export const getActiveDispositifsFromDBWithoutPopulate = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find(
    { status: "Actif", typeContenu: "dispositif" },
    needFields
  );

export const getAllContentsFromDB = async () =>
  await Dispositif.find(
    {},
    { audienceAge: 1, contenu: 1, typeContenu: 1, status: 1 }
  );

export const getAllDemarchesFromDB = async () =>
  await Dispositif.find({ typeContenu: "demarche" }, { _id: 1 });

export const removeAudienceAgeInDB = async (dispositifId: ObjectId) =>
  await Dispositif.update(
    { _id: dispositifId },
    { $unset: { audienceAge: "" } }
  );

export const removeVariantesInDB = async (dispositifId: ObjectId) =>
  await Dispositif.update({ _id: dispositifId }, { $unset: { variantes: "" } });

export const getDraftDispositifs = async (): Promise<
  DispositifPopulatedDoc[]
> =>
  // @ts-ignore populate creatorId
  await Dispositif.find(
    { status: "Brouillon" },
    {
      draftReminderMailSentDate: 1,
      draftSecondReminderMailSentDate: 1,
      creatorId: 1,
      updatedAt: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
    }
  ).populate("creatorId");

export const modifyReadSuggestionInDispositif = async (
  dispositifId: ObjectId,
  suggestionId: string
) =>
  await Dispositif.findOneAndUpdate(
    { _id: dispositifId, "suggestions.suggestionId": suggestionId },
    // @ts-ignore
    { $set: { ["suggestions.$.read"]: true } }
  );

export const getDispositifById = async (
  id: ObjectId,
  neededFields: Record<string, number>
) => await Dispositif.findOne({ _id: id }, neededFields);

export const getDispositifsWithCreatorId = async (
  creatorId: ObjectId,
  neededFields: Record<string, number>
) =>
  await Dispositif.find(
    { creatorId, status: { $ne: "Supprimé" } },
    neededFields
  ).populate("mainSponsor");

export const getDispositifByIdWithMainSponsor = async (
  id: ObjectId,
  neededFields: Record<string, number> | "all"
) => {
  if (neededFields === "all") {
    return await Dispositif.findOne({ _id: id }).populate("mainSponsor");
  }
  return await Dispositif.findOne({ _id: id }, neededFields).populate(
    "mainSponsor"
  );
};

export const getPublishedDispositifWithMainSponsor = async (): Promise<
  DispositifPopulatedDoc[]
> =>
  // @ts-ignore
  await Dispositif.find(
    { status: "Actif" },
    {
      created_at: 1,
      updatedAt: 1,
      mainSponsor: 1,
      lastReminderMailSentToUpdateContentDate: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
      typeContenu: 1,
    }
  ).populate("mainSponsor");

export const getActiveContents = async (neededFields: Record<string, number>) =>
  await Dispositif.find({ status: "Actif" }, neededFields);

export const getActiveContentsFiltered = async (
  neededFields: Record<string, number>,
  query: any
) => await Dispositif.find(query, neededFields).populate("mainSponsor");

export const getDispositifByIdWithAllFields = async (id: ObjectId) =>
  await Dispositif.findOne({ _id: id });

export const createDispositifInDB = async (dispositif: DispositifDoc) =>
  await new Dispositif(dispositif).save();

export const getNbMercis = async () => {
  return Dispositif.aggregate([
    {
      $match: { status: "Actif" },
    },
    {
      $project: {
        _id: null,
        mercis: {
          $size: { "$ifNull": [ "$merci", [] ] }
        },
      }
    },
    {
      $group: {
        _id: null,
        mercis: { $sum: "$mercis" },
      },
    },
  ]);
}
export const getNbVues = async () => {
  return Dispositif.aggregate([
    {
      $match: { status: "Actif" },
    },
    {
      $group: {
        _id: null,
        nbVues: { $sum: "$nbVues" },
        nbVuesMobile: { $sum: "$nbVuesMobile" },
      },
    },
  ]);
}
