import { DispositifStatus } from "@refugies-info/api-types";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import { addAvisDispositifInDB, getDispositifById } from "~/modules/dispositif/dispositif.repository";
import { ObjectId } from "~/typegoose";
import { Avis } from "~/typegoose/Dispositif";
import { Response } from "~/types/interface";
import { log } from "./log";

export const addAvis = async (id: string, userId: string | null, avis: boolean): Response => {
  logger.info("[addAvis] received", id);
  const dispositif = await getDispositifById(id, { mainSponsor: 1, status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  const newAvis: Avis = {
    created_at: new Date(),
    avis,
  };
  if (userId) newAvis.userId = new ObjectId(userId);
  await addAvisDispositifInDB(id, newAvis);

  await log(dispositif, id);

  return { text: "success" };
};
