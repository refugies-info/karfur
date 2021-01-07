import logger = require("../../logger");
import { Res } from "../../types/interface.js";
import { getStructuresFromDB } from "./structure.repository";

import { asyncForEach } from "../../libs/asyncForEach";
import { getUserById } from "../account/users.repository";

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1 },
      false
    );
    return res.status(200).json({ data: structures });
  } catch (error) {
    logger.error("[getActiveStructures] error while getting structures", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};

export const getAllStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllStructures] get structures ");
    const neededFields = {
      nom: 1,
      status: 1,
      picture: 1,
      dispositifsAssocies: 1,
      contact: 1,
      phone_contact: 1,
      mail_contact: 1,
      membres: 1,
      created_at: 1,
    };
    const structures = await getStructuresFromDB({}, neededFields, true);
    const simplifiedStructures = structures.map((structure) => {
      const jsonStructure = structure.toJSON();
      const nbMembres = jsonStructure.membres
        ? jsonStructure.membres.length
        : 0;
      const responsablesArray = jsonStructure.membres
        ? jsonStructure.membres.filter(
            (user) =>
              user.roles && user.userId && user.roles.includes("administrateur")
          )
        : [];
      const responsableId =
        responsablesArray.length > 0 ? responsablesArray[0].userId : null;

      const dispositifsAssocies = jsonStructure.dispositifsAssocies.filter(
        (dispo) => {
          return (
            //@ts-ignore
            dispo.status &&
            // @ts-ignore
            !["Supprimé", "Brouillon"].includes(dispo.status)
          );
        }
      );
      const nbFiches = dispositifsAssocies.length;

      delete jsonStructure.dispositifsAssocies;
      return {
        ...jsonStructure,
        nbMembres,
        responsable: responsableId,
        nbFiches,
      };
    });
    // @ts-ignore
    const data = [];
    await asyncForEach(
      simplifiedStructures,
      async (structure): Promise<any> => {
        if (structure.responsable) {
          const responsable = await getUserById(structure.responsable);
          return data.push({ ...structure, responsable });
        }
        return data.push({ ...structure, responsable: null });
      }
    );

    // @ts-ignore
    return res.status(200).json({ data });
  } catch (error) {
    logger.error("[getAllStructures] error while getting structures", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
