import Swal from "sweetalert2";
import { colors } from "colors";
import API from "../../../../utils/API";
import { GetAllDispositifsResponse, GetLanguagesResponse, Id } from "api-types";

// TODO: move function
export const prepareDeleteContrib = (
  allDispositifs: GetAllDispositifsResponse[],
  setAllDispositifsActionsCreator: any,
  dispatch: any,
  dispositifId: Id | null
) => {
  return Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "La suppression d'un dispositif est irréversible",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: colors.rouge,
    cancelButtonColor: colors.vert,
    confirmButtonText: "Oui, le supprimer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.value && dispositifId) {
      return API.updateDispositifStatus(dispositifId, { status: "Supprimé" })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Suppression effectuée",
            icon: "success",
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
            icon: "error",
            timer: 1500,
          });
        });
    }
    return;
  });
};

export const isThemeTitleOk = (title: Record<string, string>, languages: GetLanguagesResponse[]) => {
  const emptyLn = languages.filter(ln => !title[ln.i18nCode]);
  return emptyLn.length > 0;
}
