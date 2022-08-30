import Swal from "sweetalert2";
import { colors } from "colors";
import API from "../../../../utils/API";
import { ObjectId } from "mongodb";
import { Language, SimplifiedDispositif } from "types/interface";

// TODO: move function
export const prepareDeleteContrib = (
  allDispositifs: SimplifiedDispositif[],
  setAllDispositifsActionsCreator: any,
  dispatch: any,
  dispositifId: ObjectId | null
) => {
  return Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "La suppression d'un dispositif est irréversible",
    type: "question",
    showCancelButton: true,
    confirmButtonColor: colors.rouge,
    cancelButtonColor: colors.vert,
    confirmButtonText: "Oui, le supprimer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.value) {
      const newDispositif = {
        dispositifId: dispositifId,
        status: "Supprimé",
      };

      return API.updateDispositifStatus({ query: newDispositif })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Suppression effectuée",
            type: "success",
            timer: 1500,
          });
          const dispositifs = [...allDispositifs];
          const newDispositif = dispositifs.find((d) => d._id === dispositifId);
          if (newDispositif) newDispositif.status = "Supprimé";
          dispatch(setAllDispositifsActionsCreator(dispositifs));
        })
        .catch(() => {
          Swal.fire({
            title: "Oh non!",
            text: "Something went wrong",
            type: "error",
            timer: 1500,
          });
        });
    }
    return;
  });
};

export const isThemeTitleOk = (title: Record<string, string>, languages: Language[]) => {
  const emptyLn = languages.filter(ln => !title[ln.i18nCode]);
  return emptyLn.length > 0;
}
