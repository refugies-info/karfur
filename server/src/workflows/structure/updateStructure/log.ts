import { Structure, UserId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (structure: Partial<Structure>, oldStructure: Structure, authorId: UserId) => {
  if (structure.picture?.imgId && structure.picture?.imgId !== oldStructure.picture?.imgId) {
    await addLog(structure._id, "Structure", "Logo modifié", {
      author: authorId,
      link: {
        id: structure._id,
        model_link: "Structure",
        next: "PageAnnuaire"
      }
    });
  }
  if (structure.nom && structure.nom !== oldStructure.nom) {
    await addLog(structure._id, "Structure", "Nom de la structure modifié", {
      author: authorId,
      link: {
        id: structure._id,
        model_link: "Structure",
        next: "PageAnnuaire"
      }
    });
  }
  if (structure.status && structure.status !== oldStructure.status) {
    await addLog(structure._id, "Structure", "Statut modifié : " + structure.status, { author: authorId });
  }
  if (structure.adminComments && structure.adminComments !== oldStructure.adminComments) {
    await addLog(structure._id, "Structure", "Note interne modifiée", { author: authorId });
  }

  delete structure.status;
  delete structure.adminProgressionStatus;
  delete structure.adminPercentageProgressionStatus;
  delete structure.adminComments;

  const nbPropertiesEdited = Object.keys(structure).filter((key) => key !== "_id").length;
  if (
    nbPropertiesEdited > 0 &&
    structure.picture?.imgId &&
    structure.picture?.imgId === oldStructure.picture?.imgId &&
    structure.nom === oldStructure.nom
  ) {
    await addLog(structure._id, "Structure", "Fiche annuaire modifiée", {
      author: authorId,
      link: {
        id: structure._id,
        model_link: "Structure",
        next: "PageAnnuaire"
      }
    });
  }
};
