import { DispositifStatus } from "@refugies-info/api-types";
import { Types } from "mongoose";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import {
  getDispositifById,
  updateAvisDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import type { Avis } from "~/typegoose/Dispositif";
import type { Response } from "~/types/interface";

export const updateAvis = async (
  id: string,
  userId: string | undefined,
  anonymousUserId: string | undefined,
  avis: boolean,
  language: string | undefined,
): Response => {
  const dispositif = await getDispositifById(id, { status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to update feedbacks");
  }

  // Define avis data
  const avisData: Avis = {
    created_at: new Date(),
    userId: userId ? new Types.ObjectId(userId) : undefined,
    anonymousUserId: anonymousUserId ? anonymousUserId : undefined,
    avis,
    language: language || "fr",
  };

  try {
    await updateAvisDispositifInDB(id, avisData);
    return { text: "success" };
  } catch (error) {
    logger.error("[updateAvis] Error updating feedback", error);
    return { text: "error" };
  }
};
