import { DispositifId, LangueId, TraductionId, Traductions, TraductionsModel, UserId } from "src/typegoose";

type TraductionsKeys = keyof Traductions;
type TraductionsFieldsRequest = Partial<Record<TraductionsKeys, number>>;

export const getTraductionsByLanguage = (langue: string, neededFields: TraductionsFieldsRequest) =>
  TraductionsModel.find({ langueCible: langue }, neededFields);

export const getTraductionsByLanguageAndDispositif = (
  langueCible: LangueId,
  dispositifId: DispositifId,
  neededFields: TraductionsFieldsRequest = {},
) => TraductionsModel.find({ langueCible, dispositifId }, neededFields);

export const validateTradInDB = (tradId: TraductionId, validatorId: UserId) =>
  TraductionsModel.findOneAndUpdate({ _id: tradId }, { status: "Validée", validatorId }, { upsert: true, new: true });

export const deleteTradsInDB = (articleId: DispositifId, langueCible: string) =>
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

export const updateTradsWithARevoir = (articleId: DispositifId, langueCible: string, avancement: number) =>
  TraductionsModel.updateMany({ articleId, langueCible }, { status: "À revoir", avancement }, { upsert: false });

export const updateTradInDB = (_id: TraductionId, trad: any) =>
  TraductionsModel.findOneAndUpdate({ _id }, trad, {
    upsert: true,
    new: true,
  });

export const getPublishedTradIds = (languei18nCode: string) =>
  TraductionsModel.distinct("articleId", {
    langueCible: languei18nCode,
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
