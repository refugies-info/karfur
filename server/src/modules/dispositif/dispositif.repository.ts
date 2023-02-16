import { FilterQuery } from "mongoose";
import { Dispositif, DispositifId, DispositifModel, UserId } from "../../typegoose";
import { Id, Picture } from "../../types/interface";

export const getDispositifsFromDB = async () =>
  await DispositifModel.find({}).populate<{
    mainSponsor: { _id: Id, nom: string, status: string, picture: Picture },
    creatorId: { _id: Id, username: string, picture: Picture, email: string },
    lastModificationAuthor: { _id: Id, username: string },
    publishedAtAuthor: { _id: Id, username: string },
  }>([
    { path: "mainSponsor", select: "_id nom status picture" },
    { path: "creatorId", select: "_id username picture email" },
    { path: "lastModificationAuthor", select: "_id username" },
    { path: "publishedAtAuthor", select: "_id username" },
  ]).lean();

type DispositifKeys = keyof Dispositif;
type DispositifFieldsRequest = Partial<Record<DispositifKeys, number>>;

export const getDispositifArray = async (
  query: FilterQuery<Dispositif>,
  extraFields: DispositifFieldsRequest = {},
  populate: string = "",
  limit: number = 0,
  sort: any = {}
) => {
  const neededFields: DispositifFieldsRequest = {
    translations: 1,
    theme: 1,
    secondaryThemes: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    // avancement: 1,
    status: 1,
    nbMots: 1,
    nbVues: 1,
    metadatas: 1,
    ...extraFields
  };

  return DispositifModel
    .find(query, neededFields)
    .sort(sort)
    .limit(limit)
    .populate<{ mainSponsor: { _id: Id, nom: string, picture: Picture } }>({ path: "mainSponsor", select: "_id nom picture" })
    .lean()
    .populate(populate);
};

export const updateDispositifInDB = async (
  dispositifId: DispositifId,
  modifiedDispositif: Partial<Dispositif> | { $pull: { [x: string]: { suggestionId: string } } } | { $push: any }
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif, {
    upsert: true,
    new: true
  }).populate("theme secondaryThemes");

export const getActiveDispositifsFromDBWithoutPopulate = (needFields: Object) =>
  DispositifModel.find({ status: "Actif", typeContenu: "dispositif" }, needFields);

// TODO: delete
// export const getAllContentsFromDB = async () =>
//   await DispositifModel.find({}, { audienceAge: 1, contenu: 1, typeContenu: 1, status: 1 });
//
// export const getAllDemarchesFromDB = async () => await DispositifModel.find({ typeContenu: "demarche" }, { _id: 1 });
//
// export const removeAudienceAgeInDB = async (dispositifId: DispositifId) =>
//   await DispositifModel.update({ _id: dispositifId }, { $unset: { audienceAge: "" } });
//
// export const removeVariantesInDB = async (dispositifId: DispositifId) =>
//   await DispositifModel.update({ _id: dispositifId }, { $unset: { variantes: "" } });

export const getDraftDispositifs = () =>
  DispositifModel.find(
    { status: "Brouillon" },
    {
      draftReminderMailSentDate: 1,
      draftSecondReminderMailSentDate: 1,
      creatorId: 1,
      updatedAt: 1,
      lastModificationDate: 1,
      titreInformatif: 1
    }
  ).populate("creatorId");

export const modifyReadSuggestionInDispositif = async (dispositifId: DispositifId, suggestionId: string) =>
  await DispositifModel.findOneAndUpdate(
    { "_id": dispositifId, "suggestions.suggestionId": suggestionId },
    { $set: { ["suggestions.$.read"]: true } }
  );

export const getDispositifById = async (
  id: DispositifId,
  neededFields: DispositifFieldsRequest = {},
  populate: any = ""
) => DispositifModel.findById(id, neededFields).populate(populate);

export const getDispositifsWithCreatorId = async (creatorId: UserId, neededFields: DispositifFieldsRequest) =>
  await DispositifModel.find({ creatorId, status: { $ne: "Supprimé" } }, neededFields).populate<{ mainSponsor: { nom: string } }>("mainSponsor", "nom");

export const getDispositifByIdWithMainSponsor = async (
  id: DispositifId,
  neededFields: DispositifFieldsRequest | "all"
) => {
  if (neededFields === "all") {
    return await DispositifModel.findOne({ _id: id }).populate("mainSponsor theme secondaryThemes");
  }
  return await DispositifModel.findOne({ _id: id }, neededFields).populate("mainSponsor theme secondaryThemes");
};

export const getPublishedDispositifWithMainSponsor = async (): Promise<Dispositif[]> =>
  await DispositifModel.find(
    { status: "Actif" },
    {
      created_at: 1,
      updatedAt: 1,
      mainSponsor: 1,
      lastReminderMailSentToUpdateContentDate: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
      typeContenu: 1
    }
  ).populate("mainSponsor");

export const getActiveContents = async (neededFields: DispositifFieldsRequest) =>
  DispositifModel.find({ status: "Actif" }, neededFields);

export const getActiveContentsFiltered = async (neededFields: DispositifFieldsRequest, query: any) =>
  await DispositifModel.find(query, neededFields).populate("mainSponsor theme secondaryThemes");

export const getDispositifByIdWithAllFields = (id: DispositifId) => DispositifModel.findOne({ _id: id });

export const createDispositifInDB = async (dispositif: Dispositif) =>
  (await DispositifModel.create(dispositif)).populate("theme secondaryThemes");

export const getNbMercis = async () => {
  return DispositifModel.aggregate([
    {
      $match: { status: "Actif" }
    },
    {
      $project: {
        _id: null,
        mercis: {
          $size: { $ifNull: ["$merci", []] }
        }
      }
    },
    {
      $group: {
        _id: null,
        mercis: { $sum: "$mercis" }
      }
    }
  ]);
};
export const getNbVues = async () => {
  return DispositifModel.aggregate([
    {
      $match: { status: "Actif" }
    },
    {
      $group: {
        _id: null,
        nbVues: { $sum: "$nbVues" },
        nbVuesMobile: { $sum: "$nbVuesMobile" }
      }
    }
  ]);
};

export const getNbFiches = async () => {
  const nbDispositifs = await DispositifModel.count({ status: "Actif", typeContenu: "dispositif" });
  const nbDemarches = await DispositifModel.count({ status: "Actif", typeContenu: "demarche" });

  return {
    nbDispositifs,
    nbDemarches
  };
};

export const getNbUpdatedRecently = async (date: Date) => {
  return DispositifModel.count({
    status: "Actif",
    lastModificationDate: { $gte: date, $exists: true }
  });
};

export const getCountDispositifs = async (query: FilterQuery<Dispositif>) => DispositifModel.count(query);

export const deleteNeedFromDispositifs = async (needId: string) => {
  return DispositifModel.updateMany({ needs: needId }, { $pull: { needs: needId } });
};
