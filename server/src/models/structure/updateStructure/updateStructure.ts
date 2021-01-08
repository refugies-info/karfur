import { Res, RequestFromClient, Membre } from "../../../types/interface";
import { StructureDoc } from "../../../schema/schemaStructure";
import logger = require("../../../logger");
import {
  getStructureFromDB,
  updateStructureInDB,
} from "../structure.repository";
import { ObjectId } from "mongoose";

const isUserRespoOrContrib = (membres: Membre[] | null, userId: ObjectId) => {
  if (!membres) return false;
  const membreInStructure = membres.filter(
    (membre) => membre.userId !== userId
  );

  if (membreInStructure.length === 0) return false;
  const roles = membreInStructure[0].roles;
  if (roles.includes("administrateur") || roles.includes("contributeur"))
    return true;

  return false;
};

// route called when modify structure but not its members (use another route for this)
export const updateStructure = async (
  req: RequestFromClient<StructureDoc>,
  res: Res
) => {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    try {
      const structure = req.body.query;

      logger.info("[updateStructure] try to modify structure with id", {
        id: structure._id,
      });

      const fetchedStructure = await getStructureFromDB(
        structure._id,
        false,
        "all"
      );

      if (!fetchedStructure) {
        logger.info("[updateStructure] no structure with this id", {
          id: structure._id,
        });

        throw new Error("NO_STRUCTURE_WITH_THIS_ID");
      }

      // @ts-ignore: populate roles
      const requestUserRoles: { nom: string }[] = req.user.roles;
      const requestUserId = req.userId;

      // user is admin for the platform
      const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

      // user is administrateur or contributeur of the structure
      const isUserRespoOrContribBoolean = isUserRespoOrContrib(
        fetchedStructure.membres,
        requestUserId
      );

      if (!isAdmin && !isUserRespoOrContribBoolean)
        throw new Error("USER_NOT_ATHORIZED");

      logger.info("[modifyStructure] updating stucture", {
        structureId: structure._id,
      });
      const updatedStructure = await updateStructureInDB(
        structure._id,
        structure
      );

      logger.info("[modifyStructure] successfully modified structure with id", {
        id: structure._id,
      });
      return res.status(200).json({
        text: "Succès",
        data: updatedStructure,
      });
    } catch (error) {
      logger.error("[modifyStructure] error", {
        error,
      });
      switch (error.message) {
        case "NO_STRUCTURE_WITH_THIS_ID":
          return res.status(402).json({ text: "Id non valide" });
        case "USER_NOT_ATHORIZED":
          res.status(401).json({ text: "Token invalide" });
          return;
        default:
          return res.status(500).json({ text: "Erreur interne" });
      }
    }
  }
};
