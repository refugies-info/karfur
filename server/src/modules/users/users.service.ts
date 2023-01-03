import logger from "../../logger";
import { getUserById, updateUserInDB, removeRoleAndStructureInDB, removeStructureInDB } from "./users.repository";
import { ObjectId } from "mongoose";
import { getRoleByName } from "../../controllers/role/role.repository";
import { UserDoc, USER_STATUS_DELETED } from "../../schema/schemaUser";
import { asyncForEach } from "../../libs/asyncForEach";
import { UserForMailing } from "../../types/interface";
import { isEqual, uniq, uniqWith } from "lodash";

const getUserRoles = (roles: ObjectId[] | null, newRole: ObjectId) => {
  if (!roles) return [newRole];

  return uniqWith([...roles, newRole], isEqual);
};

export const updateRoleAndStructureOfResponsable = async (userId: ObjectId, structureId: ObjectId) => {
  try {
    const user = await getUserById(userId, { roles: 1, structures: 1 });
    const hasStructureRole = await getRoleByName("hasStructure");
    const hasStructureRoleId = hasStructureRole._id;

    const newRole = getUserRoles(user.roles, hasStructureRoleId);
    const newStructures = user.structures ? uniq([...user.structures, structureId]) : [structureId];
    return await updateUserInDB(userId, {
      roles: newRole,
      structures: newStructures
    });
  } catch (error) {
    logger.error("[updateRoleAndStructureOfResponsable] error while updating role", {
      error
    });
    throw error;
  }
};

export const removeRoleAndStructureOfUser = async (userId: ObjectId, structureId: ObjectId) => {
  logger.info("[removeRoleAndStructureOfUser] delete role hasStructure and structure of membre", { membreId: userId });
  return Promise.all([getUserById(userId, {}), getRoleByName("hasStructure")]).then(([user, hasStructureRole]) =>
    /*
     * If the user has more than 1 structure, the role must stay
     * FIXME ne garanti pas l'atomicité de la transaction (lecture et écriture décorellées => solution faire une transaction ?)
     * FIXME le rôle hasStructure ne devrait pas être stocké mais calculé avec la jointure et le calcul suivant
     * hasStructure = users <join> structure sur la clé users._id == structures.membres.userId && structure.status != "Supprimé"
     *    having count(strucuture._id) > 0
     *
     * FIXME Le rôle hasStructure ne devrait pas exister car ce n'est pas un rôle !
     */
    user.structures?.length >= 2
      ? removeStructureInDB(userId, structureId)
      : removeRoleAndStructureInDB(hasStructureRole._id, userId, structureId)
  );
};

export const proceedWithLogin = async (user: UserDoc) => {
  const userToSave = { last_connected: new Date() };
  return await updateUserInDB(user._id, userToSave);
};

export const getUsersFromStructureMembres = async (structureMembres: { userId: ObjectId }[]) => {
  logger.info("[getUsersFromStructureMembres] received");
  let result: UserForMailing[] = [];
  try {
    const userNeededFields = {
      username: 1,
      email: 1,
      status: 1
    };
    await asyncForEach(structureMembres, async (membre) => {
      if (!membre.userId) return;

      try {
        const membreFromDB = await getUserById(membre.userId, userNeededFields);
        if (membreFromDB.status === USER_STATUS_DELETED) return;
        if (!membreFromDB.email) return;
        result.push({
          username: membreFromDB.username,
          _id: membreFromDB._id,
          email: membreFromDB.email
        });
      } catch (e) {
        logger.error("[getUsersFromStructureMembres] error while getting user", e);
      }
    });

    return result;
  } catch (e) {
    logger.info("[getUsersFromStructureMembres] error", e);
    return result;
  }
};
