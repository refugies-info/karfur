import { Id, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresWithDispos } from "../../../modules/structure/structure.repository";
import { ImageSchema } from "../../../typegoose";

export interface GetActiveStructuresResponse {
  _id: Id;
  nom: string;
  acronyme?: string;
  picture?: ImageSchema;
  structureTypes?: string[];
  departments?: string[];
  disposAssociesLocalisation?: string[];
}

export const getActiveStructures = async (): ResponseWithData<GetActiveStructuresResponse[]> => {

  logger.info("[getActiveStructures] get structures ");
  const structures = await getStructuresWithDispos(
    { status: "Actif" },
    {
      nom: 1,
      acronyme: 1,
      picture: 1,
      structureTypes: 1,
      departments: 1
    }
  );
  logger.info("[getActiveStructures] structures fetched");

  let newStructures: GetActiveStructuresResponse[] = [];
  structures.map((item) => {
    let newStructure: GetActiveStructuresResponse = {
      _id: item._id,
      nom: item.nom,
      acronyme: item.acronyme,
      picture: item.picture,
      structureTypes: item.structureTypes,
      departments: item.departments,
      disposAssociesLocalisation: []
    };
    if (item.dispositifsAssocies && item.dispositifsAssocies.length) {
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
    newStructures.push(newStructure);
  });

  return { text: "success", data: newStructures };
};
