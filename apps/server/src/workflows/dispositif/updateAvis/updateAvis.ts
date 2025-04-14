import { DispositifStatus } from "@refugies-info/api-types";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import { getDispositifById, updateAvisDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { ObjectId } from "~/typegoose";
import { Avis } from "~/typegoose/Dispositif";
import { Response } from "~/types/interface";

export const updateAvis = async (id: string, userId: string, avis: boolean): Response => {
  logger.info("[updateAvis] received", id);
  const dispositif = await getDispositifById(id, { status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to update feedbacks");
  }

  const updatedAvis: Avis = {
    created_at: new Date(), // Update the timestamp to the current time
    userId: new ObjectId(userId),
    avis,
  };

  await updateAvisDispositifInDB(id, userId, updatedAvis);

  return { text: "success" };
};
