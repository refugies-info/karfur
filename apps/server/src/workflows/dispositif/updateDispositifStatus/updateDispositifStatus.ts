import { DispositifStatus, DispositifStatusRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import {
  deleteDispositifInDb,
  publishDispositif,
  saveAndOverwriteDraft,
} from "~/modules/dispositif/dispositif.service";
import { Dispositif, User } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const updateDispositifStatus = async (id: string, body: DispositifStatusRequest, user: User): Response => {
  logger.info("[updateDispositifStatus]", { id, body });
  await log(id, body.status, user._id);

  if (body.status === DispositifStatus.ACTIVE) {
    await publishDispositif(id, user._id);
    return { text: "success" };
  }
  if (body.status === DispositifStatus.DELETED) {
    await deleteDispositifInDb(id, user);
    return { text: "success" };
  }

  const updatedDispositif: Partial<Dispositif> = { status: body.status };
  await saveAndOverwriteDraft(id, updatedDispositif, true); // overwrite with draft if available

  return { text: "success" };
};
