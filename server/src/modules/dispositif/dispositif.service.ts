import { ObjectId } from "mongoose";
import { updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";

import { DispositifNotPopulateDoc } from "../../schema/schemaDispositif";
import { sendMailWhenDispositifPublished } from "../mail/sendMailWhenDispositifPublished";
import { getDispositifDepartments } from "../../libs/getDispositifDepartments";

export const publishDispositif = async (dispositifId: ObjectId, userId: ObjectId) => {
  const newDispositif = {
    status: "Actif",
    publishedAt: Date.now(),
    publishedAtAuthor: userId
  };

  // @ts-ignore : updateDispositifInDB returns object with creatorId not populate
  const newDispo: DispositifNotPopulateDoc = await updateDispositifInDB(
    dispositifId,
    newDispositif
  );
  try {
    await updateLanguagesAvancement();
  } catch (error) {
    logger.error(
      "[publishDispositif] error while updating languages avancement",
      { error: error.message }
    );
  }

  try {
    await addOrUpdateDispositifInContenusAirtable(
      //@ts-ignore
      newDispo.titreInformatif?.fr || newDispo.titreInformatif,
      //@ts-ignore
      newDispo.titreMarque?.fr || newDispo.titreMarque,
      newDispo._id,
      newDispo.tags,
      newDispo.typeContenu,
      null,
      getDispositifDepartments(newDispo),
      false
    );
  } catch (error) {
    logger.error(
      "[publishDispositif] error while updating contenu in airtable",
      { error: error.message }
    );
  }

  try {
    await sendMailWhenDispositifPublished(newDispo);
  } catch (error) {
    logger.error("[publishDispositif] error while sending email", {
      error: error.message,
    });
  }
};
