import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import { StructureDoc } from "../../../schema/schemaStructure";

export const log = async (
  structure: StructureDoc,
  oldStructure: StructureDoc,
  authorId: ObjectId
) => {
  if (structure.picture?.imgId !== oldStructure.picture?.imgId) {
    await addLog(
      structure._id,
      "Structure",
      "Logo modifié",
      {
        author: authorId,
        link: {
          id: structure._id,
          model_link: "Structure",
          next: "PageAnnuaire"
        }
      }
    );
  }
  if (structure.nom !== oldStructure.nom) {
    await addLog(
      structure._id,
      "Structure",
      "Nom de la structure modifié",
      {
        author: authorId,
        link: {
          id: structure._id,
          model_link: "Structure",
          next: "PageAnnuaire"
        }
      }
    );
  }
  if (structure.status !== oldStructure.status) {
    await addLog(
      structure._id,
      "Structure",
      "Statut modifié : " + structure.status,
      { author: authorId }
    );
  }

  if (structure.picture?.imgId === oldStructure.picture?.imgId &&
    structure.nom === oldStructure.nom
  ) {
    await addLog(
      structure._id,
      "Structure",
      "Fiche annuaire modifiée",
      {
        author: authorId,
        link: {
          id: structure._id,
          model_link: "Structure",
          next: "PageAnnuaire"
        }
      }
    );
  }

}
