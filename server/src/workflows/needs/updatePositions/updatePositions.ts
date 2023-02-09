import logger from "../../../logger";
import { updatePositions as updatePositionsInDb } from "../../../modules/needs/needs.repository";
import { UpdatePositionsRequest } from "../../../controllers/needController";
import { NeedTranslation, ResponseWithData, Theme } from "../../../types/interface";

export interface UpdatePositionsNeedResponse {
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

export const updatePositions = async (body: UpdatePositionsRequest): ResponseWithData<UpdatePositionsNeedResponse[]> => {
  logger.info("[updatePositions] received");

  const data = await updatePositionsInDb(body.orderedNeedIds);

  return {
    text: "success",
    data
  }
}
