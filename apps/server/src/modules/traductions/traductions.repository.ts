import type { Id, Languages } from "@refugies-info/api-types";
import {
  type Dispositif,
  type DispositifId,
  type Traductions,
  TraductionsModel,
  TraductionsType,
  type UserId,
} from "@refugies-info/mongo";
import { uniq } from "lodash";
import type { FilterQuery, ProjectionType } from "mongoose";
import { computeTraductionFinished } from "~/modules/traductions/traductions.business";
import type { DeleteResult } from "~/types/interface";

export const getTraductionsByLanguage = (
  language: string,
  neededFields: ProjectionType<Traductions>,
) => TraductionsModel.find({ language }, neededFields);

export const getTraductionsByLanguageAndDispositif = (
  language: Languages,
  dispositifId: DispositifId,
  neededFields: ProjectionType<Traductions> = {},
) => TraductionsModel.find({ language, dispositifId }, neededFields).populate("userId");

export const getValidation = (language: Languages, dispositifId: DispositifId, userId: UserId) =>
  TraductionsModel.findOne({ language, dispositifId, userId });

export const getOtherValidationForDispositif = (
  language: Languages,
  dispositifId: DispositifId,
  userId: UserId,
) =>
  TraductionsModel.findOne({
    language,
    dispositifId,
    userId: { $ne: userId },
    type: TraductionsType.VALIDATION,
  });

export const deleteTradsInDB = (
  dispositifId: DispositifId,
  language: Languages,
): Promise<DeleteResult> =>
  TraductionsModel.deleteMany({
    dispositifId,
    language,
  });

export const findTraductors = (dispositifId: DispositifId, language: Languages) =>
  TraductionsModel.find(
    {
      dispositifId,
      language,
      type: "suggestion",
    },
    { userId: 1 },
  ).lean();

const updateAvancements = async (query: FilterQuery<Traductions>, dispositif: Dispositif) => {
  const traductions: Traductions[] = await TraductionsModel.find(query);
  if (traductions.length === 0) {
    return;
  }

  const operations = traductions.map((traduction) => ({
    updateOne: {
      filter: { _id: traduction._id },
      update: { $set: { finished: computeTraductionFinished(dispositif, traduction) } },
    },
  }));

  await TraductionsModel.bulkWrite(operations);
};

/**
 * Removes sections from translated, and from toReview or toFinish
 * +
 * update avancement
 */
export const removeTraductionsSections = async (
  dispositifId: Id,
  sections: string[],
  dispositif: Dispositif,
) => {
  const query: FilterQuery<Traductions> = { dispositifId: dispositifId };
  const sectionsToRemove = uniq(
    sections
      .map((section) => section.replace(".title", "").replace(".text", ""))
      .map((section) => `translated.${section}`),
  );
  const unsetSections = sectionsToRemove.reduce(
    (acc: Record<string, string>, curr) => ((acc[curr] = ""), acc),
    {},
  );

  const result = await TraductionsModel.updateMany(query, {
    $unset: unsetSections,
    $pull: {
      toReview: { $in: sections },
      toReviewCache: { $in: sections },
      toFinish: { $in: sections },
    },
  });
  await updateAvancements(query, dispositif);
  return result;
};

export const addToReview = async (dispositifId: Id, toReview: string[], dispositif: Dispositif) => {
  const query: FilterQuery<Traductions> = {
    dispositifId: dispositifId,
    type: TraductionsType.VALIDATION,
  };
  const result = await TraductionsModel.updateMany(query, {
    $addToSet: {
      toReview: toReview,
      toReviewCache: toReview,
    },
  });
  await updateAvancements(query, dispositif);
  return result;
};
