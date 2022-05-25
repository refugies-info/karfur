import Swal from "sweetalert2";
import { colors } from "colors";
import API from "../../../../utils/API";
import { tags } from "data/tags";
import { ObjectId } from "mongodb";
import { SimplifiedDispositif } from "types/interface";

export const getTagColor = (tagName: string) => {
  const data = tags.filter((tag) => tag.name === tagName.toLowerCase());

  if (data && data.length > 0) {
    return data[0].darkColor;
  }
  return "#212121";
};

export const getTag = (tagName: string) => {
  const data = tags.filter((tag) => tag.name === tagName.toLowerCase());

  if (data && data.length > 0) {
    return data[0];
  }
  return null;
};

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
