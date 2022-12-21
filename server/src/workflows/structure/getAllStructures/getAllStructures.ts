import { Res } from "../../../types/interface.js";
import { asyncForEach } from "../../../libs/asyncForEach";
import logger from "../../../logger";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { ObjectId } from "mongoose";
import { StructureDoc } from "../../../schema/schemaStructure.js";
import { DispositifDoc } from "../../../schema/schemaDispositif.js";

export const getAllStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllStructures] get structures ");
    const neededFields = {
      nom: 1,
      acronyme: 1,
      status: 1,
      picture: 1,
      dispositifsAssocies: 1,
      created_at: 1,
      createur: 1,
      membres: 1,
      adminComments: 1,
      adminProgressionStatus: 1,
      adminPercentageProgressionStatus: 1
    };
    const structures = await getStructuresFromDB({}, neededFields, true);
    logger.info("[getAllStructures] structures fetched");
    const simplifiedStructures = structures.map((structure) => {
      // @ts-ignore
      const jsonStructure: StructureDoc = structure.toJSON();
      const nbMembres = jsonStructure.membres?.length || 0;
      const responsablesArray = jsonStructure.membres
        ? jsonStructure.membres.filter((user) => user.roles && user.userId && user.roles.includes("administrateur"))
        : [];
      const responsableId = responsablesArray.length > 0 ? responsablesArray[0].userId : null;

      const dispositifsIds: ObjectId[] = [];

      // @ts-ignore
      jsonStructure.dispositifsAssocies.forEach((dispositif: DispositifDoc) => {
        dispositifsIds.push(dispositif._id);
      });

      // @ts-ignore
      const dispositifsAssocies = jsonStructure.dispositifsAssocies.filter((dispo: any) => {
        return (
          //@ts-ignore
          dispo.status &&
          // @ts-ignore
          !["Supprimé", "Brouillon"].includes(dispo.status)
        );
      });
      const nbFiches = dispositifsAssocies.length;

      delete jsonStructure.dispositifsAssocies;
      return {
        ...jsonStructure,
        nbMembres,
        responsable: responsableId,
        nbFiches,
        dispositifsIds
      };
    });
    const neededFieldsUser = { username: 1, picture: 1, email: 1 };
    // @ts-ignore
    const data = [];
    await asyncForEach(simplifiedStructures, async (structure): Promise<any> => {
      if (structure.responsable) {
        const responsable = await getUserById(structure.responsable, neededFieldsUser);
        return data.push({ ...structure, responsable });
      }
      return data.push({ ...structure, responsable: null });
    });

    // @ts-ignore
    return res.status(200).json({ data });
  } catch (error) {
    logger.error("[getAllStructures] error while getting structures", {
      error
    });

    return res.status(500).json({
      text: "Erreur interne"
    });
  }
};
