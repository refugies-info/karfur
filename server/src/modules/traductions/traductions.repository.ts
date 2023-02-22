import { DispositifId, Languages, TraductionId, Traductions, TraductionsModel, UserId } from "src/typegoose";

type TraductionsKeys = keyof Traductions;
type TraductionsFieldsRequest = Partial<Record<TraductionsKeys, number>>;

export const getTraductionsByLanguage = (language: string, neededFields: TraductionsFieldsRequest) =>
  TraductionsModel.find({ language }, neededFields);

export const getTraductionsByLanguageAndDispositif = (
  language: Languages,
  dispositifId: DispositifId,
  neededFields: TraductionsFieldsRequest = {},
) => TraductionsModel.find({ language, dispositifId }, neededFields).populate("userId");

export const validateTradInDB = (tradId: TraductionId, validatorId: UserId) =>
  TraductionsModel.findOneAndUpdate({ _id: tradId }, { status: "Validée", validatorId }, { upsert: true, new: true });

export const deleteTradsInDB = (articleId: DispositifId, langueCible: Languages) =>
  TraductionsModel.deleteMany({
    articleId,
    langueCible,
    isExpert: { $ne: true },
  });

export const getExpertTraductionByLanguage = (articleId: DispositifId, langueCible: string) =>
  TraductionsModel.find(
    {
      articleId,
      langueCible,
      isExpert: true,
    },
    {},
    { sort: { updatedAt: -1 } },
  );

export const updateTradsWithARevoir = (articleId: DispositifId, language: string, avancement: number) =>
  TraductionsModel.updateMany({ articleId, language }, { status: "À revoir", avancement }, { upsert: false });

export const updateTradInDB = (_id: TraductionId, trad: any) =>
  TraductionsModel.findOneAndUpdate({ _id }, trad, {
    upsert: true,
    new: true,
  });

export const getPublishedTradIds = (language: string) =>
  TraductionsModel.distinct("articleId", {
    language,
    status: "Validée",
  });

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
