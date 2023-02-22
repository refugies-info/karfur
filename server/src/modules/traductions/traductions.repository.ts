import { Languages } from "api-types";
import { RefactorTodoError } from "src/errors";
import { DispositifId, TraductionId, Traductions, TraductionsModel, UserId } from "../../typegoose";

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
 * @deprecated "Il faut utiliser la propriété toReview"
 * @param dispositifId
 * @param language
 * @param avancement
 */
export const updateTradsWithARevoir = (dispositifId: DispositifId, language: string, avancement: number) => {
  throw new RefactorTodoError();
};
// TraductionsModel.updateMany({ dispositifId, language }, { status: "À revoir", avancement }, { upsert: false });

// export const updateTradInDB = (_id: TraductionId, trad: any) =>
//   TraductionsModel.findOneAndUpdate({ _id }, trad, {
//     upsert: true,
//     new: true,
//   });

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
