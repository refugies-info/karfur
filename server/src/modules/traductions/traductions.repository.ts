import { Languages } from "@refugies-info/api-types";
import { DispositifId, Traductions, TraductionsModel } from "../../typegoose";

type TraductionsKeys = keyof Traductions;
type TraductionsFieldsRequest = Partial<Record<TraductionsKeys, number>>;

export const getTraductionsByLanguage = (language: string, neededFields: TraductionsFieldsRequest) =>
  TraductionsModel.find({ language }, neededFields);

export const getTraductionsByLanguageAndDispositif = (
  language: Languages,
  dispositifId: DispositifId,
  neededFields: TraductionsFieldsRequest = {},
) => TraductionsModel.find({ language, dispositifId }, neededFields).populate("userId");

export const deleteTradsInDB = (dispositifId: DispositifId, language: Languages) =>
  TraductionsModel.deleteMany({
    dispositifId,
    language,
  });

/**
 * @deprecated TODO refactor : status not exist anymore
 *
 * @param language
 * @returns
 */
export const getPublishedTradIds = (language: string) =>
  TraductionsModel.distinct("dispositifId", {
    language,
    status: "Validée",
  });

/**
 * @deprecated TODO refactor : status not exist anymore
 * @returns
 */
export const getNbWordsTranslated = () =>
  TraductionsModel.aggregate([
    {
      $match: {
        status: "Validée",
      },
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$nbMots" },
      },
    },
  ]);
