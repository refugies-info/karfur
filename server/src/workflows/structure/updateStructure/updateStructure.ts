import logger from "../../../logger";
import { updateStructureInDB, getStructureFromDB } from "../../../modules/structure/structure.repository";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";
import { log } from "./log";
import { addStructureForUsers, removeStructureOfAllUsers } from "../../../modules/users/users.service";
import { User } from "../../../typegoose";
import { Response } from "../../../types/interface";
import { PatchStructureRequest } from "@refugies-info/api-types";

export const updateStructure = async (id: string, body: PatchStructureRequest, user: User): Response => {
  logger.info("[updateStructure] try to modify structure with id", { id });
  await checkIfUserIsAuthorizedToModifyStructure(id, user);
  logger.info("[modifyStructure] updating stucture", { structureId: id });

  const oldStructure = await getStructureFromDB(id, false, {
    picture: 1,
    nom: 1,
    status: 1,
    adminComments: 1,
  });
  const updatedStructure = await updateStructureInDB(id, body);

  if (updatedStructure?.status === "Supprimé") {
    /**
     * Lors de la "suppression" de la structure, il faut supprimer
     * la structure dans la propriété structures de tous les utilisateurs
     * @see removeRoleAndStructureOfUser
     */
    await removeStructureOfAllUsers(id);
  } else if (
    oldStructure.status === "Supprimé" &&
    (updatedStructure?.status === "Actif" || updatedStructure?.status === "En attente")
  ) {
    /**
     * Lors de l'activation de la structure depuis le status supprimé, il faut
     * réenregistrer la structure dans la propriété structures de tous les utilisateurs
     * @see updateRoleAndStructureOfResponsable
     */
    await addStructureForUsers(
      updatedStructure.membres.map((membre) => membre.userId.toString()),
      id,
    );
  }

  await log(updatedStructure, oldStructure, user._id);
  logger.info("[modifyStructure] successfully modified structure with id", { id });

  return { text: "success" };
};
