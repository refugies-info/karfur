import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger = require("../../../logger");
import { updateDispositifInDB } from "../../../controllers/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";

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
    } else {
      newDispositif = { status };
    }
    await updateDispositifInDB(dispositifId, newDispositif);

    if (status === "Actif") {
      try {
        await updateLanguagesAvancement();
      } catch (error) {
        logger.info(
          "[updateDispositifStatus] error while updating languages avancement",
          { error }
        );
      }
    }
    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifStatus] error", { error: error.message });
    return res.status(500).json({ text: "Erreur interne" });
  }
};
