import { DispositifStatus } from "@refugies-info/api-types";
import type { Merci } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import {
  addMerciDispositifInDB,
  getDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const addMerci = async (id: string, userId: string | null): Response => {
  logger.info("[addMerci] received", id);
  const dispositif = await getDispositifById(id, { mainSponsor: 1, status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  const newMerci: Merci = {
    created_at: new Date(),
  };
  if (userId) newMerci.userId = new ObjectId(userId);
  await addMerciDispositifInDB(id, newMerci);

  await log(dispositif, id);

  return { text: "success" };
};
