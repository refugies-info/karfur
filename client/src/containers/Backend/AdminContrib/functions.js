import Swal from "sweetalert2";

import variables from "scss/colors.scss";

const prepareDeleteContrib = function (dispositif) {
  Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "La suppression d'un dispositif est irréversible",
    type: "question",
    showCancelButton: true,
    confirmButtonColor: variables.rouge,
    cancelButtonColor: variables.vert,
    confirmButtonText: "Oui, le supprimer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.value) {
      const newDispositif = {
        dispositifId: dispositif._id,
        status: "Supprimé",
      };
      this.deleteContrib(
        newDispositif,
        null,
        this._initializeContrib(this.props)
      );
    }
  });
};

export { prepareDeleteContrib };
