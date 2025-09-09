import { DispositifStatus } from "@refugies-info/api-types";
import { Types } from "mongoose";
import { AuthenticationError } from "~/errors";
import { getDispositifById, updateAvisDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { Avis } from "~/typegoose/Dispositif";
import { Response } from "~/types/interface";

export const updateAvis = async (
  id: string,
  userId: string | null,
  anonymousUserId: string | null,
  avis: boolean,
  language: string | null,
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

  await updateAvisDispositifInDB(id, avisData);
  return { text: "success" };
};
