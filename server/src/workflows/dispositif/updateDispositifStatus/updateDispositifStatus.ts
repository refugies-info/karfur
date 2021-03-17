import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";

interface QueryUpdate {
  dispositifId: ObjectId;
  status: string;
}
export const updateDispositifStatus = async (
  req: RequestFromClient<QueryUpdate>,
  res: Res
) => {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (!req.body || !req.body.query) {
      return res.status(400).json({ text: "Requête invalide" });
    }

    const { dispositifId, status } = req.body.query;
    logger.info("[updateDispositifStatus]", { dispositifId, status });
    let newDispositif;
    if (status === "Actif") {
      newDispositif = { status, publishedAt: Date.now() };
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
            "[add_dispositif] error while updating contenu in airtable",
            { error }
          );
        }
      }
      return res.status(200).json({ text: "OK" });
    }

    newDispositif = { status };
    await updateDispositifInDB(dispositifId, newDispositif);
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifStatus] error", { error: error.message });
    return res.status(500).json({ text: "Erreur interne" });
  }
};
