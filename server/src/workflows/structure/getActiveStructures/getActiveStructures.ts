import { Res } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { StructureSimplifiedWithLoc } from "../../../schema/schemaStructure";

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB(
      { status: "Actif" },
      {
        nom: 1,
        acronyme: 1,
        picture: 1,
        structureTypes: 1,
        departments: 1
      },
      true
    );
    logger.info("[getActiveStructures] structures fetched");

    let newStructures: StructureSimplifiedWithLoc[] = [];
    structures.map((item) => {
      let newStructure = {
        _id: item._id,
        nom: item.nom,
        acronyme: item.acronyme,
        picture: item.picture,
        structureTypes: item.structureTypes,
        departments: item.departments,
        //@ts-ignore
        disposAssociesLocalisation: []
      };
      if (item.dispositifsAssocies && item.dispositifsAssocies.length) {
        //@ts-ignore
        item.dispositifsAssocies.map((el: any) => {
          if (el.contenu && el.contenu[1] && el.contenu[1].children && el.contenu[1].children.length) {
            const geolocInfocard = el.contenu[1].children.find((infocard: any) => infocard.title === "Zone d'action");
            if (geolocInfocard && geolocInfocard.departments) {
              for (var i = 0; i < geolocInfocard.departments.length; i++) {
                if (!newStructure.disposAssociesLocalisation.includes(geolocInfocard.departments[i])) {
                  newStructure.disposAssociesLocalisation.push(geolocInfocard.departments[i]);
                }
              }
            }
          }
        });
      }
      //@ts-ignore
      newStructures.push(newStructure);
    });

    return res.status(200).json({ data: newStructures });
  } catch (error) {
    logger.error("[getActiveStructures] error while getting structures", {
      error
    });

    return res.status(500).json({
      text: "Erreur interne"
    });
  }
};
