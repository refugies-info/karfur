import { ObjectId } from "mongoose";
import { updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../../controllers/langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";

import { DispositifNotPopulateDoc } from "../../schema/schemaDispositif";
import {
  sendPublishedMailToCreator,
  sendPublishedMailToStructureMembers,
} from "./dispositif.mail.service";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { getTitreInfoOrMarque } from "./dispositif.adapter";

export const publishDispositif = async (dispositifId: ObjectId) => {
  const newDispositif = { status: "Actif", publishedAt: Date.now() };

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
        "[publishDispositif] error while updating contenu in airtable",
        { error }
      );
    }

    try {
      const structureMembres = await getStructureMembers(newDispo.mainSponsor);
      const membresToSendMail = await getUsersFromStructureMembres(
        structureMembres
      );
      const titreInformatif = getTitreInfoOrMarque(newDispo.titreInformatif);
      const titreMarque = getTitreInfoOrMarque(newDispo.titreMarque);
      const lien =
        "https://refugies.info/" + newDispo.typeContenu + "/" + newDispo._id;

      await sendPublishedMailToStructureMembers(
        membresToSendMail,
        titreInformatif,
        titreMarque,
        lien,
        newDispo._id
      );
      const isCreatorInStructure = structureMembres.filter(
        (membre) => membre.userId.toString() === newDispo.creatorId.toString()
      );

      if (!isCreatorInStructure) {
        await sendPublishedMailToCreator(
          newDispo,
          titreInformatif,
          titreMarque,
          lien
        );
      }
    } catch (error) {
      logger.error("[publishDispositif] error while sending email", { error });
    }
  }
};
