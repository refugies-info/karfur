import { NeedTranslation, ResponseWithData, Theme } from "../../../types/interface";
import logger from "../../../logger";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";

export interface GetNeedResponse {
  theme: Theme;
  adminComments?: string;
  nbVues: number;
  position?: number;
  fr: NeedTranslation;
  ar: NeedTranslation;
  en: NeedTranslation;
  ru: NeedTranslation;
  fa: NeedTranslation;
  ti: NeedTranslation;
  ps: NeedTranslation;
  uk: NeedTranslation;
}

export const getNeeds = async (): ResponseWithData<GetNeedResponse[]> => {
  logger.info("[getNeeds] get needs");
  const needs = await getNeedsFromDB();

  return {
    text: "success",
    data: needs
  };
};

export default [getNeeds];
