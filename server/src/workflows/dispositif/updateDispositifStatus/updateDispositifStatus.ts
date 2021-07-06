import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import {
  updateDispositifInDB,
  getDispositifByIdWithMainSponsor,
} from "../../../modules/dispositif/dispositif.repository";
import { publishDispositif } from "../../../modules/dispositif/dispositif.service";
import {
  checkRequestIsFromSite,
  checkIfUserIsAdmin,
  checkUserIsAuthorizedToModifyDispositif,
} from "../../../libs/checkAuthorizations";
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
    checkRequestIsFromSite(req.fromSite);

    if (!req.body || !req.body.query) {
      throw new Error("INVALID_REQUEST");
    }

    const { dispositifId, status } = req.body.query;
    logger.info("[updateDispositifStatus]", { dispositifId, status });
    let newDispositif;
    if (status === "Actif") {
      // @ts-ignore : populate roles
      checkIfUserIsAdmin(req.user.roles);
      await publishDispositif(dispositifId);

      return res.status(200).json({ text: "OK" });
    }

    if (status === "Supprimé") {
      const neededFields = {
        creatorId: 1,
        mainSponsor: 1,
        status: 1,
      };

      const dispositif = await getDispositifByIdWithMainSponsor(
        dispositifId,
        neededFields
      );
      checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        req.userId,
        // @ts-ignore : populate roles
        req.user.roles
      );
      if (dispositif.typeContenu === "dispositif") {
        await addOrUpdateDispositifInContenusAirtable(
          dispositif.titreInformatif,
          dispositif.titreMarque,
          dispositif._id,
          dispositif.tags,
          null,
          true
        );
      }
    }

    newDispositif = { status };
    await updateDispositifInDB(dispositifId, newDispositif);
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifStatus] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(404).json({ text: "Non authorisé" });

      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
