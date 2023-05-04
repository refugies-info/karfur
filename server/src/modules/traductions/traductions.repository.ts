import { Languages } from "@refugies-info/api-types";
import { DispositifId, Traductions, TraductionsModel, UserId } from "../../typegoose";

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
