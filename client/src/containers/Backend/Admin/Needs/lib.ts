import Swal from "sweetalert2";
import { colors } from "colors";
import API from "../../../../utils/API";
import { tags } from "data/tags";

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

export const prepareDeleteContrib = (
  setSelectedDispositif: any,
  setShowDetailsModal: any,
  fetchAllDispositifsActionsCreator: any,
  dispatch: any,
  dispositif?: any,
  dispositifId?: any
) => {
  Swal.fire({
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
        dispositifId: dispositif
          ? dispositif._id
          : dispositifId
          ? dispositifId
          : null,
        status: "Supprimé",
      };

      API.updateDispositifStatus({ query: newDispositif })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Suppression effectuée",
            type: "success",
            timer: 1500,
          });
          setSelectedDispositif(null);
          setShowDetailsModal(false);
          dispatch(fetchAllDispositifsActionsCreator());
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
  });
};
