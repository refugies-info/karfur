import { InvalidRequestError } from "~/errors";
import logger from "~/logger";
import { deleteNeedFromDispositifs, getCountDispositifs } from "~/modules/dispositif/dispositif.repository";
import { deleteNeedById } from "~/modules/needs/needs.repository";
import { Response } from "~/types/interface";

export const deleteNeed = async (id: string): Response => {
  logger.info("[deleteNeed] received", id);

  // prevent from deleting if active dispositifs associated
  const activeDispositifs = await getCountDispositifs({
    status: { $ne: "Supprimé" },
    needs: id,
  });
  if (activeDispositifs > 0) {
    throw new InvalidRequestError("There is still active dispositifs for this need.");
  }

  // delete need from dispositifs if necessary
  await deleteNeedFromDispositifs(id);
  await deleteNeedById(id);

  return { text: "success" };
};
