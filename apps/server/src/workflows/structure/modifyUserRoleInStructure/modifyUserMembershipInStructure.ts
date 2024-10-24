import { PatchStructureRolesRequest, RoleName } from "@refugies-info/api-types";
import logger from "~/logger";
import { sendNewMemberMailService } from "~/modules/mail/mail.service";
import { getRoleByName } from "~/modules/role/role.repository";
import { getStructureFromDB, updateStructureMember } from "~/modules/structure/structure.repository";
import { checkIfUserIsAuthorizedToModifyStructure } from "~/modules/structure/structure.service";
import { getUserById } from "~/modules/users/users.repository";
import { addStructureForUsers, removeStructureOfUser } from "~/modules/users/users.service";
import { User } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const modifyUserMembershipInStructure = async (
  id: string,
  body: PatchStructureRolesRequest,
  user: User,
): Response => {
  const { membreId, action } = body;

  logger.info("[modifyUserMembershipInStructure] try to modify structure with id", {
    id,
    action,
    membreId,
  });

  await checkIfUserIsAuthorizedToModifyStructure(id, user);

  logger.info("[modifyUserMembershipInStructure] updating stucture", {
    id,
  });
  let structure;

  if (action === "delete") {
    structure = {
      _id: id,
      $pull: { membres: { userId: membreId } },
    };
  } else if (action === "create") {
    // FIXME: if create and already in members -> bug
    structure = {
      _id: id,
      $addToSet: {
        membres: {
          userId: membreId,
          added_at: new Date(),
        },
      },
    };
  } else {
    throw new Error("ERREUR");
  }
  const membreIdToSend = action === "create" ? null : membreId;
  await updateStructureMember(membreIdToSend, structure);

  await log(action, membreId, id, user._id);

  const structureData = await getStructureFromDB(structure._id, { nom: 1, status: 1 });
  if (action === "create") {
    const user = await getUserById(membreId, { email: 1, firstName: 1, roles: 1 });
    const adminRole = await getRoleByName(RoleName.ADMIN);
    const userIsAdmin = (user.roles || []).some((x) => x && x.toString() === adminRole._id.toString());
    if (!user || !structureData) {
      logger.error("[modifyUserMembershipInStructure] mail not sent");
    } else if (userIsAdmin) {
      logger.info("[modifyUserMembershipInStructure] user is admin, mail not sent");
    } else {
      await sendNewMemberMailService({
        userId: user._id,
        email: user.email,
        firstName: user.firstName || "",
        nomstructure: structureData.nom,
      });
    }
  }

  // if delete, remove role and structure in corresponding user
  // if modify no need to update the user since he was already in the structure
  if (action === "delete") {
    await removeStructureOfUser(membreId, structure._id);
  } else if (action === "create" && structureData.status !== "Supprimé") {
    // Ne pas ajouter la structure à l'utilisateur si celle-ci
    // est supprimée.
    await addStructureForUsers([membreId], id);
  }

  return { text: "success" };
};
