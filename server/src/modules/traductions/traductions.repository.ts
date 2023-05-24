import { Id, Languages } from "@refugies-info/api-types";
import { uniq } from "lodash";
import { TraductionsType } from "../../typegoose/Traductions";
import { Dispositif, DispositifId, Traductions, TraductionsModel, UserId } from "../../typegoose";
import { FilterQuery } from "mongoose";

type TraductionsKeys = keyof Traductions;
type TraductionsFieldsRequest = Partial<Record<TraductionsKeys, number>>;

export const getTraductionsByLanguage = (language: string, neededFields: TraductionsFieldsRequest) =>
  TraductionsModel.find({ language }, neededFields);

export const getTraductionsByLanguageAndDispositif = (
  language: Languages,
  dispositifId: DispositifId,
  neededFields: TraductionsFieldsRequest = {},
) => TraductionsModel.find({ language, dispositifId }, neededFields).populate("userId");

export const getValidation = (language: Languages, dispositifId: DispositifId, userId: UserId) =>
  TraductionsModel.findOne({ language, dispositifId, userId });

export const deleteTradsInDB = (dispositifId: DispositifId, language: Languages) =>
  TraductionsModel.deleteMany({
    dispositifId,
    language,
  });

export const findTraductors = (dispositifId: DispositifId, language: Languages) =>
  TraductionsModel.find({
    dispositifId,
    language,
    type: "suggestion"
  }, { userId: 1 }).lean();


const updateAvancements = async (query: FilterQuery<Traductions>, dispositif: Dispositif) => {
  const traductions: Traductions[] = await TraductionsModel.find(query);
  await Promise.all(traductions.map(traduction => TraductionsModel.updateOne(
    { _id: traduction._id },
    { avancement: Traductions.computeAvancement(dispositif, traduction) }
  )));
}

/**
 * Removes sections from translated, and from toReview or toFinish
 * +
 * update avancement
 */
export const removeTraductionsSections = async (dispositifId: Id, sections: string[], dispositif: Dispositif) => {
  const query: FilterQuery<Traductions> = { dispositifId: dispositifId };
  const sectionsToRemove = uniq(sections
    .map(section => section.replace(".title", "").replace(".text", ""))
    .map(section => `translated.${section}`)
  );
  const unsetSections = sectionsToRemove.reduce((acc: any, curr) => (acc[curr] = "", acc), {});

  const result = await TraductionsModel.updateMany(
    query,
    {
      $unset: unsetSections,
      $pull: {
        toReview: { $in: sections },
        toFinish: { $in: sections }
      },
    }
  );
  await updateAvancements(query, dispositif);
  return result;
}

export const addToReview = async (dispositifId: Id, toReview: string[], dispositif: Dispositif) => {
  const query: FilterQuery<Traductions> = { dispositifId: dispositifId, type: TraductionsType.VALIDATION };
  const result = await TraductionsModel.updateMany(
    query,
    { $push: { toReview: { $each: toReview } } }
  );
  await updateAvancements(query, dispositif);
  return result;
}
