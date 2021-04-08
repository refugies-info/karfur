import { ObjectId } from "mongoose";
import { updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../../controllers/langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";
import { sendPublishedFicheMail } from "../mail/mail.service";
import { getUserById } from "../users/users.repository";
import { isTitreInformatifObject } from "../../types/typeguards";
import { DispositifNotPopulateDoc } from "../../schema/schemaDispositif";
import { getStructureFromDB } from "../structure/structure.repository";
import { asyncForEach } from "../../libs/asyncForEach";

const getTitreInfoOrMarque = (
  titre: string | Record<string, string> | null
): string => {
  if (!titre) return "";
  if (isTitreInformatifObject(titre)) {
    return titre.fr;
  }
  return titre;
};

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
      const titreInformatif = getTitreInfoOrMarque(newDispo.titreInformatif);
      const titreMarque = getTitreInfoOrMarque(newDispo.titreMarque);

      const userNeededFields = {
        username: 1,
        email: 1,
        status: 1,
      };

      const creator = await getUserById(newDispo.creatorId, userNeededFields);
      if (creator.status === "Exclu") return;
      if (creator.email) {
        logger.info("[publish dispositif] creator has email");
        await sendPublishedFicheMail({
          pseudo: creator.username,
          titreInformatif: titreInformatif,
          titreMarque: titreMarque,
          lien:
            "https://refugies.info/" +
            newDispo.typeContenu +
            "/" +
            newDispo._id,
          email: creator.email,
          dispositifId: newDispo._id,
          userId: creator._id,
        });
      }

      const structureNeededFields = { membres: 1 };
      const structure = await getStructureFromDB(
        newDispo.mainSponsor,
        false,
        structureNeededFields
      );

      if (!structure || !structure.membres || structure.membres.length === 0) {
        return;
      }
      await asyncForEach(structure.membres, async (membre) => {
        if (!membre.userId) return;
        if (membre.userId.toString() === newDispo.creatorId.toString()) {
          return;
        }
        const membreFromDB = await getUserById(membre.userId, userNeededFields);
        if (membreFromDB.status === "Exclu") return;
        if (!membreFromDB.email) return;

        logger.info("[publish dispositif] send mail to membre", {
          membreId: membreFromDB._id,
        });
        await sendPublishedFicheMail({
          pseudo: membreFromDB.username,
          titreInformatif: titreInformatif,
          titreMarque: titreMarque,
          lien:
            "https://refugies.info/" +
            newDispo.typeContenu +
            "/" +
            newDispo._id,
          email: membreFromDB.email,
          dispositifId: newDispo._id,
          userId: membreFromDB._id,
        });
      });
    } catch (error) {
      logger.error("[publishDispositif] error while sending email", { error });
    }
  }
};
