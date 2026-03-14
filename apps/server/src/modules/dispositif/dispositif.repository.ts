import {
  ContentType,
  DispositifStatus,
  type Id,
  type Languages,
  type Picture,
  type Suggestion as SuggestionAPIType,
} from "@refugies-info/api-types";
import type { Avis, Merci, Suggestion } from "@refugies-info/mongo";
import {
  type DemarcheContent,
  type Dispositif,
  type DispositifContent,
  DispositifDraftModel,
  type DispositifId,
  DispositifModel,
  type Need,
  ObjectId,
  type Theme,
  type UserId,
} from "@refugies-info/mongo";
import { omit, pick, union, uniq } from "lodash";
import { map } from "lodash/fp";
import type { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import { cleanupAvis } from "~/libs/cleanupAvis";
import type { DispositifAbstracts } from "~/modules/dispositif/types";
import type { DeleteResult } from "~/types/interface";
import { getUsersById } from "../users/users.repository";
import { getAvailableLanguages, getDispositifTranslation } from "./dispositif.business";

export const getDispositifsFromDB = async () =>
  await DispositifModel.find({})
    .populate<{
      mainSponsor: { _id: Id; nom: string; status: string; picture: Picture };
      creatorId: { _id: Id; username: string; picture: Picture; email: string };
      lastModificationAuthor: { _id: Id; username: string | undefined; email: string };
      publishedAtAuthor: { _id: Id; username: string | undefined; email: string };
    }>([
      { path: "mainSponsor", select: "_id nom status picture" },
      { path: "creatorId", select: "_id username picture email" },
      { path: "lastModificationAuthor", select: "_id email username" },
      { path: "publishedAtAuthor", select: "_id email username" },
    ])
    .lean();

type DispositifKeys = keyof Dispositif;
type DispositifFieldsRequest = Partial<Record<DispositifKeys, number>>;

/**
 * Result type for getDispositifsWithCreatorId — a subset of Dispositif fields
 * (determined at runtime by neededFields) with a projected mainSponsor.
 * mainSponsor is omitted from Partial<Dispositif> (ObjectId ref) and replaced
 * with the populated shape emitted by the $lookup + $unwind pipeline stages.
 */
type DispositifContributionAggResult = Omit<Partial<Dispositif>, "mainSponsor"> & {
  mainSponsor?: { _id: Id; nom: string };
};

export const getDispositifsForExport = async () => {
  return DispositifModel.find({ status: "Actif" })
    .populate<{
      mainSponsor: { _id: Id; nom: string; picture: Picture };
      needs: { _id: Id; fr: Need["fr"] };
      themes: { _id: Id; short: Theme["short"] };
      secondaryThemes: { _id: Id; short: Theme["short"] }[];
    }>([
      { path: "mainSponsor", select: "_id nom picture" },
      { path: "needs", select: "_id fr" },
      { path: "theme", select: "_id short" },
      { path: "secondaryThemes", select: "_id short" },
    ])
    .lean();
};

export const getDispositifArray = async (
  query: FilterQuery<Dispositif>,
  extraFields: ProjectionType<Dispositif> = {},
  populate: string = "",
  limit: number = 0,
  sort = {},
) => {
  const neededFields: ProjectionType<Dispositif> = Object.assign(
    {
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
    },
    extraFields,
  );

  const dispositifs = await DispositifModel.find(query, neededFields)
    .sort(sort)
    .limit(limit)
    .populate<{ mainSponsor: { _id: Id; nom: string; picture: Picture } }>({
      path: "mainSponsor",
      select: "_id nom picture",
    })
    .populate<{ theme: { _id: Id; position: number } }>({
      path: "theme",
      select: "_id position",
    })
    .lean()
    .populate(populate)
    .cacheQuery();

  return dispositifs.map((dispositif) => ({
    ...dispositif,
    theme: dispositif.theme?._id,
    sortThemeIndex: dispositif.theme?.position || 0,
  }));
};

export const getSimpleDispositifs = async (
  query: FilterQuery<Dispositif>,
  locale: Languages,
  limit: number = 0,
  sort: object = {},
) => {
  return getDispositifArray(
    query,
    {
      lastModificationDate: 1,
      mainSponsor: 1,
      needs: 1,
      translations: 1,
      nbVuesMobile: 1,
      hasDraftVersion: 1,
      administrationLogo: 1,
      typeContenu: 1,
      origin: 1,
    },
    "",
    limit,
    sort,
  ).then(
    map((dispositif) => {
      const translation = getDispositifTranslation(dispositif, locale);
      const resDisp = {
        _id: dispositif._id,
        ...pick(translation.content, ["titreInformatif", "titreMarque", "abstract"]),
        metadatas: dispositif.metadatas,
        ...omit(dispositif, ["translations", "mainSponsor"]),
        availableLanguages: getAvailableLanguages(dispositif),
        hasDraftVersion: dispositif.hasDraftVersion,
        themeSortIndex: dispositif.sortThemeIndex,
        origin: dispositif.origin ?? "RI",
        sponsor: null as Partial<typeof dispositif.mainSponsor>,
      };
      if (dispositif.typeContenu === ContentType.DISPOSITIF && dispositif.mainSponsor) {
        resDisp.sponsor = dispositif.mainSponsor;
      }
      if (
        dispositif.typeContenu === ContentType.DEMARCHE &&
        (dispositif.administrationLogo ||
          (translation.content as DemarcheContent).administrationName)
      ) {
        resDisp.sponsor = {
          nom: (translation.content as DemarcheContent).administrationName,
          picture: dispositif.administrationLogo as any,
        };
      }
      return resDisp;
    }),
  );
};

export const getStructureDispositifs = async (
  query: FilterQuery<Dispositif>,
  locale: Languages,
  limit: number = 0,
  sort = {},
) => {
  return getDispositifArray(
    query,
    {
      lastModificationDate: 1,
      mainSponsor: 1,
      needs: 1,
      translations: 1,
      nbVuesMobile: 1,
      hasDraftVersion: 1,
      merci: 1,
      avis: 1,
      suggestions: 1,
      administrationLogo: 1,
      typeContenu: 1,
      origin: 1,
    },
    "suggestions.userId",
    limit,
    sort,
  )
    .then(async (dispositifs) => {
      const usernames = await Promise.all(
        dispositifs.map(async (dispositif) =>
          dispositif.suggestions.length > 0
            ? await getUsersById<{ _id: ObjectId; username: string }>(
                uniq(
                  dispositif.suggestions
                    .map((s: (typeof dispositif.suggestions)[number]) => s.userId)
                    .filter((id: unknown) => !!id),
                ),
                {
                  username: 1,
                },
              )
            : [],
        ),
      );
      return { dispositifs, usernames: union(...usernames) };
    })
    .then(({ dispositifs, usernames }) =>
      dispositifs.map((dispositif) => {
        const translation = getDispositifTranslation(dispositif, locale);
        const suggestions: SuggestionAPIType[] = dispositif.suggestions.map((s) => {
          return {
            ...(pick(s, ["created_at", "read", "suggestion", "suggestionId", "section"]) as any),
            username:
              usernames.find((u) => u._id.toString() === s.userId?.toString())?.username || "",
          };
        });
        const resDisp = {
          _id: dispositif._id,
          ...pick(translation.content, ["titreInformatif", "titreMarque", "abstract"]),
          metadatas: dispositif.metadatas,
          ...omit(dispositif, ["translations", "merci", "mainSponsor"]),
          availableLanguages: getAvailableLanguages(dispositif),
          hasDraftVersion: dispositif.hasDraftVersion,
          nbMercis: dispositif.merci.length,
          suggestions,
          themeSortIndex: dispositif.sortThemeIndex,
          origin: dispositif.origin ?? "RI",
          sponsor: null as Partial<typeof dispositif.mainSponsor>,
        };
        if (dispositif.typeContenu === ContentType.DISPOSITIF && dispositif.mainSponsor) {
          resDisp.sponsor = dispositif.mainSponsor;
        }
        if (
          dispositif.typeContenu === ContentType.DEMARCHE &&
          (dispositif.administrationLogo ||
            (translation.content as DemarcheContent).administrationName)
        ) {
          resDisp.sponsor = {
            nom: (translation.content as DemarcheContent).administrationName,
            picture: dispositif.administrationLogo as any,
          };
        }
        return resDisp;
      }),
    );
};

export const updateDispositifInDB = async (
  dispositifId: DispositifId,
  modifiedDispositif:
    | Partial<Dispositif>
    | { $pull: { [x: string]: { suggestionId: string } } }
    | { $push: unknown },
  updateDraft: boolean = false,
): Promise<Dispositif> => {
  return updateDraft
    ? DispositifDraftModel.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif, {
        upsert: true,
        new: true,
      }).populate("theme secondaryThemes")
    : DispositifModel.findOneAndUpdate({ _id: dispositifId }, modifiedDispositif, {
        upsert: true,
        new: true,
      }).populate("theme secondaryThemes");
};

export const deleteDraftDispositif = async (id: DispositifId): Promise<DeleteResult> =>
  DispositifDraftModel.deleteOne({ _id: id });

export const addMerciDispositifInDB = async (
  dispositifId: DispositifId,
  merci: Merci,
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate(
    { _id: dispositifId },
    { $push: { merci } },
    {
      upsert: true,
      new: true,
    },
  );

export const addAvisDispositifInDB = async (
  dispositifId: DispositifId,
  avis: Avis,
): Promise<Dispositif> => {
  return DispositifModel.findOneAndUpdate(
    { _id: dispositifId },
    { $push: { avis: cleanupAvis(avis) } },
    {
      upsert: true,
      new: true,
    },
  );
};

export const addNewParticipant = async (dispositifId: DispositifId, userId: Id) =>
  DispositifModel.findOneAndUpdate({ _id: dispositifId }, { $addToSet: { participants: userId } });

export const removeMerciDispositifInDB = async (
  dispositifId: DispositifId,
  userId: UserId,
): Promise<Dispositif> => {
  if (userId) {
    // remove merci of user
    return DispositifModel.findOneAndUpdate(
      { _id: dispositifId },
      { $pull: { merci: { userId } } },
      {
        upsert: true,
        new: true,
      },
    );
  }
  // if no user id, remove last merci without userId
  const dispositif = await DispositifModel.findOne({ _id: dispositifId }, { merci: 1 });
  if (!dispositif) return;
  const newMerci = [...(dispositif.merci || [])];
  for (let i = newMerci.length - 1; i >= 0; i--) {
    if (!newMerci[i].userId) {
      newMerci.splice(i, 1);
      break;
    }
  }
  return DispositifModel.findOneAndUpdate({ _id: dispositifId }, { merci: newMerci });
};

export const removeAvisDispositifInDB = async (
  dispositifId: DispositifId,
  userId: UserId,
  anonymousUserId: string | undefined,
): Promise<Dispositif> => {
  const pullQuery: { userId?: UserId; anonymousUserId?: string } = {};
  if (userId !== undefined) pullQuery.userId = userId;
  if (anonymousUserId !== undefined) pullQuery.anonymousUserId = anonymousUserId;

  return DispositifModel.findOneAndUpdate(
    { _id: dispositifId },
    { $pull: { avis: pullQuery } },
    { new: true },
  );
};

export const addSuggestionDispositifInDB = async (
  dispositifId: DispositifId,
  suggestion: Suggestion,
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate(
    { _id: dispositifId },
    { $push: { suggestions: suggestion } },
    {
      upsert: true,
      new: true,
    },
  );

export const deleteSuggestionDispositifInDB = async (
  dispositifId: DispositifId,
  suggestionId: string,
): Promise<Dispositif> =>
  DispositifModel.findOneAndUpdate(
    { _id: dispositifId },
    { $pull: { suggestions: { suggestionId } } },
    {
      upsert: true,
      new: true,
    },
  );

export const updateAvisDispositifInDB = async (
  dispositifId: DispositifId,
  updatedAvis: Avis,
): Promise<{ modifiedCount: number }> => {
  try {
    // First, get the dispositif with all its reviews
    const dispositif = await DispositifModel.findOne({ _id: dispositifId }, { avis: 1 });

    if (!dispositif) return { modifiedCount: 0 };

    // Find the index of the review to update
    let avisIndex = -1;
    if (updatedAvis.userId) {
      avisIndex = dispositif.avis.findIndex(
        (avis) => avis.userId && avis.userId.toString() === updatedAvis.userId.toString(),
      );
    }
    if (avisIndex === -1 && updatedAvis.anonymousUserId) {
      avisIndex = dispositif.avis.findIndex(
        (avis) => avis.anonymousUserId === updatedAvis.anonymousUserId.toString(),
      );
    }
    if (avisIndex === -1) return { modifiedCount: 0 };

    const updateQuery = {
      $set: {
        [`avis.${avisIndex}`]: cleanupAvis(updatedAvis),
      },
    };

    const result = await DispositifModel.updateOne({ _id: dispositifId }, updateQuery);

    return { modifiedCount: result.modifiedCount };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating avis:", error);
    return { modifiedCount: 0 };
  }
};

export const incrementDispositifViews = async (
  id: string,
  properties: ("nbFavoritesMobile" | "nbVues" | "nbVuesMobile")[],
) => {
  const query: UpdateQuery<Dispositif> = { $inc: {} };
  for (const prop of properties) {
    query.$inc[prop] = 1;
  }
  return DispositifModel.findOneAndUpdate({ _id: new ObjectId(id) }, query);
};

export const getActiveDispositifsFromDBWithoutPopulate = (needFields: ProjectionType<Dispositif>) =>
  DispositifModel.find(
    { status: DispositifStatus.ACTIVE, typeContenu: ContentType.DISPOSITIF },
    needFields,
  );

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

export const modifyReadSuggestionInDispositif = async (
  dispositifId: DispositifId,
  suggestionId: string,
) =>
  await DispositifModel.findOneAndUpdate(
    { _id: dispositifId, "suggestions.suggestionId": suggestionId },
    { $set: { ["suggestions.$.read"]: true } },
  );

export const getDispositifName = async (id: Id) =>
  DispositifModel.findById(id, { "translations.fr.content.titreInformatif": 1 }).then(
    (res) => getDispositifTranslation(res as any, "fr")?.content.titreInformatif,
  );

export const getDispositifById = async (
  id: DispositifId,
  neededFields: ProjectionType<Dispositif> = {},
  populate = "",
) => DispositifModel.findById(id, neededFields).populate(populate).cacheQuery();

export const getDraftDispositifById = async (
  id: DispositifId,
  neededFields: ProjectionType<Dispositif> = {},
  populate = "",
) => DispositifDraftModel.findById(id, neededFields).populate(populate);

/**
 * Get dispositifs with creatorId
 * @param creatorId The creatorId of the dispositif
 * @param neededFields The fields to return in the dispositif
 * @returns A list of dispositifs with the specified fields
 */
export const getDispositifsWithCreatorId = async (
  creatorId: UserId,
  neededFields: DispositifFieldsRequest,
) => {
  const user = await getUsersById([creatorId] as UserId[], {
    _id: 1,
    structures: 1,
  });

  const pipeline = [
    // Filter dispositifs with creatorId and status not equal to "Supprimé"
    {
      $match: {
        creatorId: new ObjectId(creatorId),
        status: { $ne: "Supprimé" },
      },
    },
    // Populate mainSponsor with the structure
    {
      $lookup: {
        from: "structures",
        localField: "mainSponsor",
        foreignField: "_id",
        as: "mainSponsor",
      },
    },
    // Unwind the mainSponsor array
    {
      $unwind: {
        path: "$mainSponsor",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (user[0]?.structures?.length > 0) {
    pipeline.push(
      // Filter dispositifs where the creator is a member of the mainSponsor structure
      // or where the mainSponsor structure does not exist
      {
        $match: {
          //@ts-expect-error $or is not a valid property
          $or: [
            { "mainSponsor.createur": "$_id" },
            { "mainSponsor.membres.userId": "$_id" },
            { mainSponsor: { $exists: false } },
          ],
        },
      },
    );
  }

  pipeline.push(
    // Project the fields to return
    {
      //@ts-expect-error $project is not a valid property
      $project: {
        ...neededFields,
        mainSponsor: {
          _id: 1,
          nom: 1,
        },
      },
    },
  );

  // Cast required: speedgoose's Aggregate<R, ResultType> augmentation breaks awaited type inference
  return (await DispositifModel.aggregate(pipeline)) as DispositifContributionAggResult[];
};

export const getDispositifByIdWithMainSponsor = async (
  id: DispositifId,
  neededFields: ProjectionType<Dispositif>,
) => {
  if (neededFields === "all") {
    return await DispositifModel.findOne({ _id: id }).populate("mainSponsor theme secondaryThemes");
  }
  return await DispositifModel.findOne({ _id: id }, neededFields).populate(
    "mainSponsor theme secondaryThemes",
  );
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
  )
    .populate("mainSponsor")
    .cacheQuery();

export const getActiveContents = (
  neededFields: ProjectionType<Dispositif>,
): Promise<Dispositif[]> =>
  DispositifModel.find(
    { status: DispositifStatus.ACTIVE },
    neededFields,
  ).cacheQuery() as unknown as Promise<Dispositif[]>;

export const getActiveContentsFiltered = (
  neededFields: ProjectionType<Dispositif>,
  query: unknown,
): Promise<Dispositif[]> =>
  DispositifModel.find(query, neededFields)
    .populate("mainSponsor theme secondaryThemes")
    .cacheQuery() as unknown as Promise<Dispositif[]>;

export const getDispositifByIdWithAllFields = (id: DispositifId) =>
  DispositifModel.findOne({ _id: id });

export const createDispositifInDB = async (dispositif: Partial<Dispositif>) =>
  DispositifModel.create(dispositif);

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
  ]).cachePipeline({ ttl: 300 });
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
  ]).cachePipeline({ ttl: 300 });
};

export const getNbFiches = async () => {
  const nbDispositifs = await DispositifModel.countDocuments({
    status: DispositifStatus.ACTIVE,
    typeContenu: ContentType.DISPOSITIF,
  });
  const nbDemarches = await DispositifModel.countDocuments({
    status: DispositifStatus.ACTIVE,
    typeContenu: ContentType.DEMARCHE,
  });

  return {
    nbDispositifs,
    nbDemarches,
  };
};

export const getNbUpdatedRecently = async (date: Date) => {
  return DispositifModel.countDocuments({
    status: DispositifStatus.ACTIVE,
    lastModificationDate: { $gte: date, $exists: true },
  });
};

export const getCountDispositifs = async (query: FilterQuery<Dispositif>) =>
  DispositifModel.countDocuments(query);

export const deleteNeedFromDispositifs = async (needId: string) => {
  return DispositifModel.updateMany({ needs: needId }, { $pull: { needs: needId } });
};

export const cloneDispositifInDrafts = async (id: DispositifId, newData: Partial<Dispositif>) => {
  const dispositif = await DispositifModel.findById(id).lean();
  return DispositifDraftModel.create({ ...dispositif, ...newData });
};

export const getDispositifAbstracts = async (
  query: FilterQuery<Dispositif>,
  limit: number = 3,
  sort: Record<string, 1 | -1> = { updatedAt: -1 },
): Promise<DispositifAbstracts[]> => {
  return DispositifModel.aggregate([
    { $match: query },
    { $sort: sort },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        typeContenu: 1,
        titreInformatif: "$translations.fr.content.titreInformatif",
        abstract: "$translations.fr.content.abstract",
      },
    },
  ]).cachePipeline();
};
