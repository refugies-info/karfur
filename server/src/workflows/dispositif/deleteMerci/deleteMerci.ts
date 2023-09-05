import { DispositifStatus } from "@refugies-info/api-types";
import { getDispositifById, removeMerciDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { AuthenticationError } from "../../../errors";

export const deleteMerci = async (id: string, userId: string | null): Response => {
  logger.info("[deleteMerci] received", id);
  const dispositif = await getDispositifById(id, { status: 1 });
  if (!dispositif || dispositif.status !== DispositifStatus.ACTIVE) {
    throw new AuthenticationError("Dispositif must be published to get feedbacks");
  }

  await removeMerciDispositifInDB(id, userId);

  return { text: "success" };
};

