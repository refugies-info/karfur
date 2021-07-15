import { Res } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, structureTypes: 1, departments: 1 },
      true
    );
    structures.map((item) => {
      let disposAssociesLocalisation: any[] = [];
      if (item.dispositifsAssocies && item.dispositifsAssocies.length) {
        //@ts-ignore
        item.dispositifsAssocies.map((el: any) => {
          if (
            el.status === "Actif" &&
            el.contenu &&
            el.contenu[1] &&
            el.contenu[1].children &&
            el.contenu[1].children.length
          ) {
            const geolocInfocard = el.contenu[1].children.find(
              (infocard: any) => infocard.title === "Zone d'action"
            );
            if (geolocInfocard && geolocInfocard.departments) {
              for (var i = 0; i < geolocInfocard.departments.length; i++) {
                if (
                  !disposAssociesLocalisation.includes(
                    geolocInfocard.departments[i]
                  )
                ) {
                  disposAssociesLocalisation.push(
                    geolocInfocard.departments[i]
                  );
                }
              }
            }
          }
        });
      }
      item.disposAssociesLocalisation = disposAssociesLocalisation;
      item.dispositifsAssocies = [];
    });
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
