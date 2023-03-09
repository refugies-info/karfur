import logger from "../../../logger";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import { NotFoundError } from "../../../errors";
import { Response } from "../../../types/interface";

export const addView = async (id: string): Response => {
  logger.info("[addView] received", id);

  const need = await getNeedFromDB(id);
  if (!need) throw new NotFoundError("Need does not exist");
  await saveNeedInDB(need._id, { nbVues: (need.nbVues || 0) + 1 });

  return { text: "success" }
};

