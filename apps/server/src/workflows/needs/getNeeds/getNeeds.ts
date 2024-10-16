import { GetNeedResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { getNeedsFromDB } from "~/modules/needs/needs.repository";
import { ResponseWithData } from "~/types/interface";

// TODO: stop populating themes to have a lighter response?
export const getNeeds = async (): ResponseWithData<GetNeedResponse[]> => {
  logger.info("[getNeeds] get needs");
  const needs = await getNeedsFromDB();

  return {
    text: "success",
    data: needs,
  };
};
