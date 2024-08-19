import { isDocument, Ref } from "@typegoose/typegoose";
import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";
import { Dispositif, Theme, ThemeId, UserId } from "../../../typegoose";

const getThemesIds = (themes: Ref<Theme, ThemeId> | Ref<Theme, ThemeId>[] | undefined): ThemeId[] => {
  if (!themes) return [];
  if (Array.isArray(themes)) return themes.map(theme => isDocument(theme) ? theme._id : theme);
  return [isDocument(themes) ? themes._id : themes];
}

export const log = async (dispositif: Dispositif, originalDispositif: Dispositif, authorId: UserId, draftCreated: boolean) => {
  try {
    await addLog(dispositif._id, "Dispositif", "Contenu modifié", { author: authorId });
    await addLog(authorId, "User", "Modification de la fiche : {{dynamic}}", {
      dynamicId: dispositif._id,
      model_dynamic: "Dispositif",
      link: {
        id: dispositif._id,
        model_link: "Dispositif",
        next: "ModalContenu"
      }
    });
    // status
    if (originalDispositif.status !== dispositif.status && !draftCreated) {
      await addLog(dispositif._id, "Dispositif", "Statut modifié : " + dispositif.status, {
        author: authorId
      });
    }

    const newThemes = JSON.stringify([...getThemesIds(dispositif.theme), ...getThemesIds(dispositif.secondaryThemes).sort()].filter((t) => !!t));
    const oldThemes = JSON.stringify(
      [...getThemesIds(originalDispositif.theme), ...getThemesIds(originalDispositif.secondaryThemes).sort()].filter((t) => !!t)
    );
    if (newThemes !== oldThemes) {
      await addLog(dispositif._id, "Dispositif", "Thèmes modifiés", { author: authorId });
    }

    // sponsor
    const oldSponsorId = originalDispositif.mainSponsor ? originalDispositif.getMainSponsor()?._id : null;
    const newSponsorId = dispositif.mainSponsor;
    const oldSponsorIdString = (oldSponsorId || "").toString();
    const newSponsorIdString = (newSponsorId || "").toString();

    if (oldSponsorIdString !== newSponsorIdString) {
      if (!!oldSponsorIdString && !!newSponsorIdString) {
        // sponsor changes
        await addLog(dispositif._id, "Dispositif", "Structure responsable modifiée : {{dynamic}}", {
          dynamicId: newSponsorId.toString(),
          model_dynamic: "Structure",
          link: {
            id: newSponsorId.toString(),
            model_link: "Structure",
            next: "ModalStructure"
          },
          author: authorId
        });
        await addLog(
          oldSponsorId.toString(),
          "Structure",
          "Fiche supprimée de cette structure et nouvelle structure attribuée : {{dynamic}}",
          {
            dynamicId: newSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(
          newSponsorId.toString(),
          "Structure",
          "Fiche supprimée de la structure {{dynamic}} et attribuée à cette structure",
          {
            dynamicId: oldSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
      }
      if (!oldSponsorIdString && newSponsorIdString) {
        // sponsor added
        await addLog(newSponsorId.toString(), "Structure", "Nouvelle fiche attribuée : {{dynamic}}", {
          dynamicId: dispositif._id,
          model_dynamic: "Dispositif",
          link: {
            id: dispositif._id,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        });
      }
      if (oldSponsorIdString && !newSponsorIdString) {
        // sponsor deleted
        await addLog(
          oldSponsorId.toString(),
          "Structure",
          "Fiche supprimée de la structure : {{dynamic}} et non attribuée à une nouvelle structure",
          {
            dynamicId: oldSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(dispositif._id, "Dispositif", "Structure responsable supprimée : {{dynamic}}", {
          dynamicId: oldSponsorId.toString(),
          model_dynamic: "Structure",
          link: {
            id: oldSponsorId.toString(),
            model_link: "Structure",
            next: "ModalStructure"
          },
          author: authorId
        });
      }
    }
  } catch (e) {
    logger.error("[updateDispositif] error while logging", e);
  }
};
