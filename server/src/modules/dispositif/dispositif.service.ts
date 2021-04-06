import { ObjectId } from "mongoose";
import { updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../../controllers/langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";

export const publishDispositif = async (dispositifId: ObjectId) => {
  const newDispositif = { status: "Actif", publishedAt: Date.now() };
  const newDispo = await updateDispositifInDB(dispositifId, newDispositif);
  try {
    await updateLanguagesAvancement();
  } catch (error) {
    logger.info(
      "[updateDispositifStatus] error while updating languages avancement",
      { error }
    );
  }
  if (newDispo.typeContenu === "dispositif") {
    try {
      await addOrUpdateDispositifInContenusAirtable(
        newDispo.titreInformatif,
        newDispo.titreMarque,
        newDispo._id,
        newDispo.tags,
        null
      );
    } catch (error) {
      logger.error(
        "[updateDispositifStatus] error while updating contenu in airtable",
        { error }
      );
    }
  }
};
