import type { AdminCommentsRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import {
  getDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import type { Dispositif, UserId } from "~/typegoose";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const updateDispositifAdminComments = async (
  id: string,
  body: AdminCommentsRequest,
  userId: UserId,
): Response => {
  const { adminComments, adminProgressionStatus } = body;

  logger.info("[updateDispositifAdminComments] data", {
    id,
    adminComments,
    adminProgressionStatus,
  });

  const modifiedDispositif: Partial<Dispositif> = {
    adminComments,
    adminProgressionStatus,
    lastAdminUpdate: new Date(),
  };

  const oldDispositif = await getDispositifById(id, { adminComments: 1 });
  const newDispositif = await updateDispositifInDB(id, modifiedDispositif);
  await log(id, newDispositif, oldDispositif, userId);

  return { text: "success" };
};
