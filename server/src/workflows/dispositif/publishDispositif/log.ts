import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";
import { Dispositif, UserId } from "../../../typegoose";

export const log = async (dispositif: Dispositif, originalDispositif: Dispositif, authorId: UserId) => {
  try {
    if (originalDispositif.status !== dispositif.status) {
      await addLog(dispositif._id, "Dispositif", "Statut modifié : " + dispositif.status, {
        author: authorId
      });
    }
  } catch (e) {
    logger.error("[publishDispositif] error while logging", e);
  }
};
