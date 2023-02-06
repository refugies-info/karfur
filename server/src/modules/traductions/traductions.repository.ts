import { DispositifId, TraductionId, TraductionsModel, UserId } from "src/typegoose";

export const getTraductionsByLanguage = (langue: string, neededFields: Record<string, number>) =>
  TraductionsModel.find({ langueCible: langue }, neededFields);

export const validateTradInDB = (tradId: TraductionId, validatorId: UserId) =>
  TraductionsModel.findOneAndUpdate({ _id: tradId }, { status: "Validée", validatorId }, { upsert: true, new: true });

export const deleteTradsInDB = (articleId: DispositifId, langueCible: string) =>
  TraductionsModel.deleteMany({
    articleId,
    langueCible,
    isExpert: { $ne: true }
  });

export const getExpertTraductionByLanguage = (articleId: DispositifId, langueCible: string) =>
  TraductionsModel.find(
    {
      articleId,
      langueCible,
      isExpert: true
    },
    {},
    { sort: { updatedAt: -1 } }
  );

export const updateTradsWithARevoir = (articleId: DispositifId, langueCible: string, avancement: number) =>
  TraductionsModel.updateMany({ articleId, langueCible }, { status: "À revoir", avancement }, { upsert: false });

export const updateTradInDB = (_id: TraductionId, trad: any) =>
  TraductionsModel.findOneAndUpdate({ _id }, trad, {
    upsert: true,
    new: true
  });

export const getPublishedTradIds = (languei18nCode: string) =>
  TraductionsModel.distinct("articleId", {
    langueCible: languei18nCode,
    status: "Validée"
  });

export const getNbWordsTranslated = () =>
  TraductionsModel.aggregate([
    {
      $match: {
        status: "Validée"
      }
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$nbMots" }
      }
    }
  ]);
