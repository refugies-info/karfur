import logger from "../../../logger";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { log } from "./log";
import { Dispositif } from "../../../typegoose";
import { AdminCommentsRequest } from "../../../controllers/dispositifController";
import { Response } from "../../../types/interface";

export const updateDispositifAdminComments = async (id: string, body: AdminCommentsRequest, userId: any): Response => {

  const { adminComments, adminProgressionStatus, adminPercentageProgressionStatus } = body;

  logger.info("[updateDispositifAdminComments] data", {
    id,
    adminComments,
    adminProgressionStatus,
    adminPercentageProgressionStatus
  });

  const modifiedDispositif: Partial<Dispositif> = {
    adminComments,
    adminProgressionStatus,
    adminPercentageProgressionStatus,
    lastAdminUpdate: new Date()
  };

  const oldDispositif = await getDispositifById(id, { adminComments: 1 });
  const newDispositif = await updateDispositifInDB(id, modifiedDispositif);
  await log(id, newDispositif, oldDispositif, userId);

  return { text: "success" };

};
