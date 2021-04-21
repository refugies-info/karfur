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
