import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { RequestFromClient, Res } from "../../../types/interface";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";
import { sendNewReponsableMailService } from "../../../modules/mail/mail.service";
import { getUserById } from "../../../modules/users/users.repository";
import { updateStructureMember, getStructureFromDB } from "../../../modules/structure/structure.repository";
import { addStructureForUsers, removeStructureOfUser } from "../../../modules/users/users.service";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { log } from "./log";

interface Query {
  membreId: ObjectId;
  structureId: ObjectId;
  action: "delete" | "modify" | "create";
  role?: string;
}
export const modifyUserRoleInStructure = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    if (!req.body || !req.body.query) {
      throw new Error("INVALID_REQUEST");
    }

    const { structureId, membreId, action, role } = req.body.query;

    logger.info("[modifyUserRoleInStructure] try to modify structure with id", {
      structureId,
      action,
      role,
      membreId
    });

    await checkIfUserIsAuthorizedToModifyStructure(
      structureId,
      req.userId,
      // @ts-ignore : populate roles
      req.user.roles
    );

    logger.info("[modifyUserRoleInStructure] updating stucture", {
      structureId
    });
    let structure;

    if (action === "modify" && role) {
      structure = {
        _id: structureId,
        $set: { "membres.$.roles": [role] }
      };
    } else if (action === "delete") {
      structure = {
        _id: structureId,
        $pull: { membres: { userId: membreId } }
      };
    } else if (action === "create" && role) {
      structure = {
        _id: structureId,
        $addToSet: {
          membres: {
            userId: membreId,
            roles: [role],
            added_at: new Date()
          }
        }
      };
    } else {
      throw new Error("ERREUR");
    }
    const membreIdToSend = action === "create" ? null : membreId;
    await updateStructureMember(membreIdToSend, structure);

    await log(action, role, membreId, structureId, req.userId);

    const structureData = await getStructureFromDB(structure._id, false, { nom: 1, status: 1 });
    if ((action === "create" || action === "modify") && role === "administrateur") {
      const user = await getUserById(membreId, { email: 1, username: 1, roles: 1 });
      const adminRole = await getRoleByName("Admin");
      const userIsAdmin = (user.roles || []).some((x) => x && x.toString() === adminRole._id.toString());
      if (!user || !structureData) {
        logger.error("[modifyUserRoleInStructure] mail not sent");
      } else if (userIsAdmin) {
        logger.info("[modifyUserRoleInStructure] user is admin, mail not sent");
      } else {
        await sendNewReponsableMailService({
          userId: user._id,
          email: user.email,
          pseudonyme: user.username,
          nomstructure: structureData.nom
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
      await addStructureForUsers([membreId], structureId);
    }

    return res.status(200).json({ text: "Succès" });
  } catch (error) {
    logger.error("[modifyUserRoleInStructure] error", {
      error
    });
    switch (error.message) {
      case "NO_STRUCTURE_WITH_THIS_ID":
        return res.status(402).json({ text: "Id non valide" });
      case "USER_NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
