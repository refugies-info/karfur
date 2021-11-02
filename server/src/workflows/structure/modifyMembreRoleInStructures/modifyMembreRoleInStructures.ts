/* NOT USED
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { checkRequestIsFromPostman } from "../../../libs/checkAuthorizations";
import {
  getStructuresFromDB,
  updateStructureInDB,
} from "../../../modules/structure/structure.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import { ObjectId } from "mongoose";

export const modifyMembreRoleInStructures = async (
  req: RequestFromClient<{}>,
  res: Res
) => {
  try {
    logger.info("[modifyMembreRoleInStructures] received");
    checkRequestIsFromPostman(req.fromPostman);
    const structures = await getStructuresFromDB({}, { membres: 1 }, false);
    let errors: { structureId: ObjectId; error: any }[] = [];
    let updatedArray: { structureId: ObjectId }[] = [];

    await asyncForEach(structures, async (structure) => {
      try {
        logger.info("[modifyMembreRoleInStructures] structure", {
          structureId: structure._id,
        });
        let needsUpdate = false;
        if (!structure.membres || structure.membres.length === 0) return;

        const filteredMembres = structure.membres.filter(
          (membre) => membre.userId && membre.roles
        );
        if (filteredMembres.length !== structure.membres.length) {
          needsUpdate = true;
        }

        const newMembres = filteredMembres.map((membre) => {
          if (membre.roles.length === 0) {
            needsUpdate = true;
            return { ...membre, roles: ["contributeur"] };
          }
          if (membre.roles.includes("membre")) {
            needsUpdate = true;
            const newRoles = membre.roles
              .filter((role) => role !== "membre")
              .concat(["contributeur"]);
            return { ...membre, roles: newRoles };
          }
          return membre;
        });

        if (needsUpdate) {
          logger.info("[modifyMembreRoleInStructures] updating structure", {
            structureId: structure._id,
            newMembres,
          });
          // @ts-ignore
          await updateStructureInDB(structure._id, { membres: newMembres });
          updatedArray.push({ structureId: structure._id });
          return;
        }
      } catch (error) {
        logger.error("[modifyMembreRoleInStructures] error with structure", {
          structureId: structure._id,
          error: error.message,
        });

        errors.push({ structureId: structure._id, error: error.message });
      }
    });

    return res.status(200).json({
      text: "OK",
      nbUpdated: updatedArray.length,
      errors: errors,
      updatedArray,
    });
  } catch (error) {
    logger.error("[modifyMembreRoleInStructures] error", {
      error: error.message,
    });
    switch (error.message) {
      case "NOT_FROM_POSTMAN":
        return res.status(404).json({ text: "KO", error: error.message });
      default:
        return res.status(500).json({ text: "KO", error: error.message });
    }
  }
};
*/
