import { AdminCommentsRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { getDispositifById, updateDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { Dispositif } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const updateDispositifAdminComments = async (id: string, body: AdminCommentsRequest, userId: any): Response => {
  const { adminComments, adminProgressionStatus, adminPercentageProgressionStatus } = body;

  logger.info("[updateDispositifAdminComments] data", {
    id,
    adminComments,
    adminProgressionStatus,
    adminPercentageProgressionStatus,
  });

  const modifiedDispositif: Partial<Dispositif> = {
    adminComments,
    adminProgressionStatus,
    adminPercentageProgressionStatus,
    lastAdminUpdate: new Date(),
  };

  const oldDispositif = await getDispositifById(id, { adminComments: 1 });
  const newDispositif = await updateDispositifInDB(id, modifiedDispositif);
  await log(id, newDispositif, oldDispositif, userId);

  return { text: "success" };
};
