import { UpdatePositionsNeedResponse, UpdatePositionsRequest } from "@refugies-info/api-types";
import logger from "../../../logger";
import { updatePositions as updatePositionsInDb } from "../../../modules/needs/needs.repository";
import { ResponseWithData } from "../../../types/interface";

export const updatePositions = async (
  body: UpdatePositionsRequest,
): ResponseWithData<UpdatePositionsNeedResponse[]> => {
  logger.info("[updatePositions] received");

  const data = await updatePositionsInDb(body.orderedNeedIds);

  return {
    text: "success",
    data,
  };
};
