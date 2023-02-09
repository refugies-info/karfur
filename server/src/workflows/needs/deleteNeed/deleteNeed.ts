import logger from "../../../logger";
import { deleteNeedById } from "../../../modules/needs/needs.repository";
import { getCountDispositifs, deleteNeedFromDispositifs } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { InvalidRequestError } from "../../../errors";

export const deleteNeed = async (id: string): Response => {
  logger.info("[deleteNeed] received", id);

  // prevent from deleting if active dispositifs associated
  const activeDispositifs = await getCountDispositifs({
    status: { $ne: "Supprimé" },
    needs: id
  });
  if (activeDispositifs > 0) {
    throw new InvalidRequestError("There is still active dispositifs for this need.");
  }

  // delete need from dispositifs if necessary
  await deleteNeedFromDispositifs(id);
  await deleteNeedById(id);

  return { text: "success" }
};

