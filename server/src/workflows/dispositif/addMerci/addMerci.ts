import { addMerciDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { Merci } from "../../../typegoose/Dispositif";
import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { ObjectId } from "../../../typegoose";
import { log } from "./log";

export const addMerci = async (id: string, userId: string | null): Response => {
  logger.info("[addMerci] received", id);
  const newMerci: Merci = {
    created_at: new Date(),
  };
  if (userId) newMerci.userId = new ObjectId(userId);
  await addMerciDispositifInDB(id, newMerci);

  const dispositif = await getDispositifById(id, { mainSponsor: 1 });
  await log(dispositif, id);

  return { text: "success" };
};

