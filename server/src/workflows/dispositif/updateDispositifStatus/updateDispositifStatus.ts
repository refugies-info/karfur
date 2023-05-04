import { DispositifStatusRequest, DispositifStatus } from "@refugies-info/api-types";
import logger from "../../../logger";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { deleteDispositifInDb, publishDispositif } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";
import { Dispositif, User } from "../../../typegoose";
import { Response } from "../../../types/interface";

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

  const newDispositif: Partial<Dispositif> = { status: body.status };
  await updateDispositifInDB(id, newDispositif);
  return { text: "success" };
};
