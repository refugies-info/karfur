import { Id, Picture, ContentType, SimpleDispositif, DispositifStatus, Languages } from "api-types";
import { omit, pick } from "lodash";
import { map } from "lodash/fp";
import { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import { Merci, Suggestion } from "../../typegoose/Dispositif";
import { Dispositif, DispositifId, DispositifModel, Need, Theme, UserId } from "../../typegoose";

export const getDispositifsFromDB = async () =>
  await DispositifModel.find({})
    .populate<{
      mainSponsor: { _id: Id; nom: string; status: string; picture: Picture };
      creatorId: { _id: Id; username: string; picture: Picture; email: string };
      lastModificationAuthor: { _id: Id; username: string };
      publishedAtAuthor: { _id: Id; username: string };
    }>([
      { path: "mainSponsor", select: "_id nom status picture" },
      { path: "creatorId", select: "_id username picture email" },
      { path: "lastModificationAuthor", select: "_id username" },
      { path: "publishedAtAuthor", select: "_id username" },
    ])
    .lean();

type DispositifKeys = keyof Dispositif;
type DispositifFieldsRequest = Partial<Record<DispositifKeys, number>>;


export const getDispositifsForExport = async (): Promise<Dispositif[]> => {
  return DispositifModel.find({ status: "Actif" })
    .populate<{
      mainSponsor: { _id: Id; nom: string; picture: Picture },
      needs: { _id: Id, fr: Need["fr"] },
      themes: { _id: Id, short: Theme["short"] },
      secondaryThemes: { _id: Id, short: Theme["short"] }[],
    }>([
      { path: "mainSponsor", select: "_id nom picture" },
      { path: "needs", select: "_id fr" },
      { path: "themes", select: "_id short" },
      { path: "secondaryThemes", select: "_id short" },
    ])
    .lean()
};

export const getDispositifArray = async (
  query: FilterQuery<Dispositif>,
  extraFields: DispositifFieldsRequest = {},
  populate: string = "",
  limit: number = 0,
  sort: any = {},
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
    ...extraFields,
  };

  return DispositifModel.find(query, neededFields)
    .sort(sort)
    .limit(limit)
    .populate<{ mainSponsor: { _id: Id; nom: string; picture: Picture } }>({
      path: "mainSponsor",
      select: "_id nom picture",
    })
    .lean()
    .populate(populate);
};

export const getSimpleDispositifs = async (
  query: FilterQuery<Dispositif>,
  locale: Languages,
  limit: number = 0,
  sort: any = {},
) => {
  return getDispositifArray(
    query,
    {
      lastModificationDate: 1,
      mainSponsor: 1,
      needs: 1,
      translations: 1,
    },
    "",
    limit,
    sort,
  ).then(
    map((dispositif) => {
      const translation = dispositif.translations[locale] || dispositif.translations.fr;
      const resDisp: SimpleDispositif = {
        _id: dispositif._id,
        ...pick(translation.content, ["titreInformatif", "titreMarque", "abstract"]),
        metadatas: { ...dispositif.metadatas, ...translation.metadatas },
        ...omit(dispositif, ["translations"]),
        availableLanguages: Object.keys(dispositif.translations)
      };
      return resDisp;
    }),
  );
};

export const updateDispositifInDB = async (
  dispositifId: DispositifId,
  modifiedDispositif: Partial<Dispositif> | { $pull: { [x: string]: { suggestionId: string } } } | { $push: any },
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif, {
    upsert: true,
    new: true,
  }).populate("theme secondaryThemes");

export const addMerciDispositifInDB = async (
  dispositifId: DispositifId,
  merci: Merci
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, { $push: { merci } }, {
    upsert: true,
    new: true,
  });

export const removeMerciDispositifInDB = async (
  dispositifId: DispositifId,
  userId: UserId
): Promise<Dispositif> => {
  if (userId) {
    // remove merci of user
    return DispositifModel.findOneAndUpdate({ _id: dispositifId }, { $pull: { merci: { userId } } }, {
      upsert: true,
      new: true,
    });
  }
  // if no user id, remove last merci without userId
  const dispositif = await DispositifModel.findOne({ _id: dispositifId }, { merci: 1 });
  if (!dispositif) return
  const newMerci = [...(dispositif.merci || [])];
  for (var i = newMerci.length - 1; i >= 0; i--) {
    if (!newMerci[i].userId) {
      newMerci.splice(i, 1);
      break;
    }
  }
  return DispositifModel.findOneAndUpdate({ _id: dispositifId }, { merci: newMerci });
}

export const addSuggestionDispositifInDB = async (
  dispositifId: DispositifId,
  suggestion: Suggestion
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, { $push: { suggestions: suggestion } }, {
    upsert: true,
    new: true,
  });

export const deleteSuggestionDispositifInDB = async (
  dispositifId: DispositifId,
  suggestionId: string
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, { $pull: { suggestions: { suggestionId } } }, {
    upsert: true,
    new: true,
  });

export const incrementDispositifViews = async (
  id: string,
  properties: ("nbFavoritesMobile" | "nbVues" | "nbVuesMobile")[],
) => {
  const query: UpdateQuery<Dispositif> = { $inc: {} };
  for (const prop of properties) {
    query.$inc[prop] = 1;
  }
  return DispositifModel.findOneAndUpdate({ id }, query);
};

export const getActiveDispositifsFromDBWithoutPopulate = (needFields: ProjectionType<Dispositif>) =>
  DispositifModel.find({ status: DispositifStatus.ACTIVE, typeContenu: ContentType.DISPOSITIF }, needFields);

export const getDraftDispositifs = () =>
  DispositifModel.find(
    { status: "Brouillon" },
    {
      draftReminderMailSentDate: 1,
      draftSecondReminderMailSentDate: 1,
      creatorId: 1,
      updatedAt: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
    },
  ).populate("creatorId");

export const modifyReadSuggestionInDispositif = async (dispositifId: DispositifId, suggestionId: string) =>
  await DispositifModel.findOneAndUpdate(
    { "_id": dispositifId, "suggestions.suggestionId": suggestionId },
    { $set: { ["suggestions.$.read"]: true } },
  );

export const getDispositifById = async (
  id: DispositifId,
  neededFields: DispositifFieldsRequest = {},
  populate: any = "",
) => DispositifModel.findById(id, neededFields).populate(populate);

export const getDispositifsWithCreatorId = async (creatorId: UserId, neededFields: DispositifFieldsRequest) =>
  await DispositifModel.find({ creatorId, status: { $ne: "Supprimé" } }, neededFields).populate<{
    mainSponsor: { nom: string };
  }>("mainSponsor", "nom");

export const getDispositifByIdWithMainSponsor = async (
  id: DispositifId,
  neededFields: DispositifFieldsRequest | "all",
) => {
  if (neededFields === "all") {
    return await DispositifModel.findOne({ _id: id }).populate("mainSponsor theme secondaryThemes");
  }
  return await DispositifModel.findOne({ _id: id }, neededFields).populate("mainSponsor theme secondaryThemes");
};

export const getPublishedDispositifWithMainSponsor = async (): Promise<Dispositif[]> =>
  await DispositifModel.find(
    { status: DispositifStatus.ACTIVE },
    {
      created_at: 1,
      updatedAt: 1,
      mainSponsor: 1,
      lastReminderMailSentToUpdateContentDate: 1,
      lastModificationDate: 1,
      titreInformatif: 1,
      typeContenu: 1,
    },
  ).populate("mainSponsor");

export const getActiveContents = async (neededFields: DispositifFieldsRequest) =>
  DispositifModel.find({ status: DispositifStatus.ACTIVE }, neededFields);

export const getActiveContentsFiltered = async (neededFields: DispositifFieldsRequest, query: any) =>
  await DispositifModel.find(query, neededFields).populate("mainSponsor theme secondaryThemes");

export const getDispositifByIdWithAllFields = (id: DispositifId) => DispositifModel.findOne({ _id: id });

export const createDispositifInDB = async (dispositif: Partial<Dispositif>) => DispositifModel.create(dispositif);

export const getNbMercis = async () => {
  return DispositifModel.aggregate([
    {
      $match: { status: DispositifStatus.ACTIVE },
    },
    {
      $project: {
        _id: null,
        mercis: {
          $size: { $ifNull: ["$merci", []] },
        },
      },
    },
    {
      $group: {
        _id: null,
        mercis: { $sum: "$mercis" },
      },
    },
  ]);
};
export const getNbVues = async () => {
  return DispositifModel.aggregate([
    {
      $match: { status: DispositifStatus.ACTIVE },
    },
    {
      $group: {
        _id: null,
        nbVues: { $sum: "$nbVues" },
        nbVuesMobile: { $sum: "$nbVuesMobile" },
      },
    },
  ]);
};

export const getNbFiches = async () => {
  const nbDispositifs = await DispositifModel.count({
    status: DispositifStatus.ACTIVE,
    typeContenu: ContentType.DISPOSITIF,
  });
  const nbDemarches = await DispositifModel.count({
    status: DispositifStatus.ACTIVE,
    typeContenu: ContentType.DEMARCHE,
  });

  return {
    nbDispositifs,
    nbDemarches,
  };
};

export const getNbUpdatedRecently = async (date: Date) => {
  return DispositifModel.count({
    status: DispositifStatus.ACTIVE,
    lastModificationDate: { $gte: date, $exists: true },
  });
};

export const getCountDispositifs = async (query: FilterQuery<Dispositif>) => DispositifModel.count(query);

export const deleteNeedFromDispositifs = async (needId: string) => {
  return DispositifModel.updateMany({ needs: needId }, { $pull: { needs: needId } });
};
