import logger from "../../../logger";
import { Res, RequestFromClient } from "../../../types/interface";
import { updateStructureInDB, getStructureFromDB } from "../../../modules/structure/structure.repository";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";
import { StructureDoc } from "../../../schema/schemaStructure";
import { log } from "./log";
import { addStructureForUsers, removeStructureOfAllUsers } from "src/modules/users/users.service";

// route called when modify structure but not its members (use another route for this)
export const updateStructure = async (req: RequestFromClient<Partial<StructureDoc>>, res: Res) => {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.query) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    try {
      const structure = req.body.query;

      logger.info("[updateStructure] try to modify structure with id", {
        id: structure._id
      });

      await checkIfUserIsAuthorizedToModifyStructure(
        structure._id,
        req.userId,
        // @ts-ignore : populate roles
        req.user.roles
      );

      logger.info("[modifyStructure] updating stucture", {
        structureId: structure._id
      });
      const oldStructure = await getStructureFromDB(structure._id, false, {
        picture: 1,
        nom: 1,
        status: 1,
        adminComments: 1
      });
      const updatedStructure = await updateStructureInDB(structure._id, structure);

      if (structure?.status === "Supprimé") {
        /**
         * Lors de la "suppression" de la structure, il faut supprimer
         * la structure dans la propriété structures de tous les utilisateurs
         * @see removeRoleAndStructureOfUser
         */
        await removeStructureOfAllUsers(structure._id);
      } else if (
        oldStructure.status === "Supprimé" &&
        (structure?.status === "Actif" || structure?.status === "En attente")
      ) {
        /**
         * Lors de l'activation de la structure depuis le status supprimé, il faut
         * réenregistrer la structure dans la propriété structures de tous les utilisateurs
         * @see updateRoleAndStructureOfResponsable
         */
        await addStructureForUsers(
          updatedStructure.membres.map((membre) => membre.userId),
          structure._id
        );
      }

      await log(structure, oldStructure, req.userId);
      logger.info("[modifyStructure] successfully modified structure with id", {
        id: structure._id
      });
      return res.status(200).json({
        text: "Succès",
        data: updatedStructure
      });
    } catch (error) {
      logger.error("[modifyStructure] error", error);
      switch (error.message) {
        case "NO_STRUCTURE_WITH_THIS_ID":
          return res.status(402).json({ text: "Id non valide" });
        case "USER_NOT_AUTHORIZED":
          res.status(401).json({ text: "Token invalide" });
          return;
        default:
          return res.status(400).json({ text: "Erreur interne" });
      }
    }
  }
};
