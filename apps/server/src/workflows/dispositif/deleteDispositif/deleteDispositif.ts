import logger from "~/logger";
import { deleteDispositifInDb } from "~/modules/dispositif/dispositif.service";
import { User } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const deleteDispositif = async (id: string, user: User): Response => {
  logger.info("[deleteDispositif] received", { id, user: user._id });

  await deleteDispositifInDb(id, user);
  await log(id, user._id);

  return { text: "success" };
};
