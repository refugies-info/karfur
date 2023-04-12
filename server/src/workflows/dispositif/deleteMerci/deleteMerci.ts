import { removeMerciDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import logger from "../../../logger";
import { Response } from "../../../types/interface";

export const deleteMerci = async (id: string, userId: string | null): Response => {
  logger.info("[deleteMerci] received", id);
  await removeMerciDispositifInDB(id, userId);

  return { text: "success" };
};

