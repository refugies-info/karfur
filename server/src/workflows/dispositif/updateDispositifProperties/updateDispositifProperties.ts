import logger from "../../../logger";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { UpdateDispositifPropertiesRequest } from "../../../controllers/dispositifController";
import { Response } from "../../../types/interface";

export const updateDispositifProperties = async (id: string, body: UpdateDispositifPropertiesRequest): Response => {
  logger.info("[updateDispositifProperties] received", id);

  const editedDispositif = {
    webOnly: body.webOnly,
    lastAdminUpdate: new Date()
  };

  await updateDispositifInDB(id, editedDispositif);

  return { text: "success" };
};

