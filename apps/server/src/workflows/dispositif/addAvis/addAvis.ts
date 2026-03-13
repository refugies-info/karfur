import { DispositifStatus } from "@refugies-info/api-types";
import type { Avis } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { AuthenticationError } from "~/errors";
import logger from "~/logger";
import {
  addAvisDispositifInDB,
  getDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const addAvis = async (
  id: string,
  userId: string | null,
  anonymousUserId: string | null,
  avis: boolean,
  language: string | null,
): Response => {
  logger.info("[addAvis] received", id);
  const dispositif = await getDispositifById(id, { mainSponsor: 1, status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  const newAvis: Avis = {
    created_at: new Date(),
    avis,
    language: language || "fr",
    userId: userId ? new ObjectId(userId) : undefined,
    anonymousUserId: anonymousUserId ? anonymousUserId : undefined,
  };

  try {
    await addAvisDispositifInDB(id, newAvis);
    await log(dispositif, id);
  } catch (error) {
    logger.error("[addAvis] Error adding feedback", error);
    return { text: "error" };
  }

  return { text: "success" };
};
