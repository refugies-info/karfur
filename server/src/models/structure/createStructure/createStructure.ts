import {
  Res,
  RequestFromClient,
  Picture,
  Membre,
} from "../../../types/interface";
import logger = require("../../../logger");
import { updateRoleAndStructureOfResponsable } from "../../../controllers/account/users.service";
import { createStructureInDB } from "../structure.repository";

interface ReceivedStructure {
  picture: Picture | null;
  status: string;
  contact: string;
  phone_contact: string;
  mail_contact: string;
  membres: Membre[];
  nom: string;
}

export const createStructure = async (
  req: RequestFromClient<ReceivedStructure>,
  res: Res
) => {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.query) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    try {
      const structure = req.body.query;
      logger.info("[createStructure] call received", { structure });
      const structureToSave = {
        ...structure,
        createur: req.userId,
        status: structure.status || "En attente",
      };

      // @ts-ignore
      const newStructure = await createStructureInDB(structureToSave);
      const structureId = newStructure._id;
      if (structure.membres.length > 0) {
        // if we create a structure there is maximum one membre
        const responsableId =
          newStructure.membres[0] && newStructure.membres[0].userId
            ? newStructure.membres[0] && newStructure.membres[0].userId
            : "";

        if (responsableId) {
          await updateRoleAndStructureOfResponsable(responsableId, structureId);
        }
      }
      logger.info("[createStructure] successfully created structure with id", {
        structureId,
      });

      return res.status(200).json({
        text: "Succès",
      });
    } catch (err) {
      logger.error("[createStructure] error while creating structure", {
        error: err,
      });
      res.status(500).json({ text: "Erreur interne" });
    }
  }
};
