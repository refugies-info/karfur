import { Traduction } from "../../schema/schemaTraduction";
import { ObjectId } from "mongoose";

export const getTraductionsByLanguage = async (
  langue: string,
  neededFields: Record<string, number>
) => await Traduction.find({ langueCible: langue }, neededFields);

export const validateTradInDB = async (
  tradId: ObjectId,
  validatorId: ObjectId
) =>
  await Traduction.findOneAndUpdate(
    { _id: tradId },
    { status: "Validée", validatorId },
    // @ts-ignore
    { upsert: true, new: true }
  );

export const deleteTradsInDB = async (
  articleId: ObjectId,
  langueCible: string
) =>
  // @ts-ignore
  await Traduction.deleteMany({
    articleId,
    langueCible,
    isExpert: { $ne: true },
  });

export const getExpertTraductionByLanguage = async (
  articleId: ObjectId,
  langueCible: string
) =>
  await Traduction.find(
    {
      articleId,
      langueCible,
      isExpert: true,
    },
    {},
    { sort: { updatedAt: -1 } }
  );

export const updateTradsWithARevoir = async (
  articleId: ObjectId,
  langueCible: string,
  avancement: number
) =>
  await Traduction.updateMany(
    { articleId, langueCible },
    { status: "À revoir", avancement },
    { upsert: false }
  );

export const updateTradInDB = async (_id: ObjectId, trad: any) =>
  await Traduction.findOneAndUpdate({ _id }, trad, {
    upsert: true,
    // @ts-ignore
    new: true,
  });
