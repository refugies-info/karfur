import { GetLogResponse } from "@refugies-info/api-types";
import logger from "../../../logger";
import { findLogs } from "../../../modules/logs/logs.repository";
import { ResponseWithData } from "../../../types/interface";

export const getLogs = async (id: string): ResponseWithData<GetLogResponse[]> => {
  logger.info("[getLogs] received with id", id);
  const logs = await findLogs(id);

  return {
    text: "success",
    data: logs,
  };
};
