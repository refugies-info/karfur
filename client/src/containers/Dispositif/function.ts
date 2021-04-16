import Swal from "sweetalert2";
import API from "../../utils/API";

declare const window: Window;
export const send_sms = (
  title: string,
  typeContenu: string,
  titreInformatif: string
) =>
  Swal.fire({
    title: title,
    input: "tel",
    inputPlaceholder: "0633445566",
    inputAttributes: {
      autocomplete: "on",
    },
    showCancelButton: true,
    confirmButtonText: "Envoyer",
    cancelButtonText: "Annuler",
    showLoaderOnConfirm: true,
    preConfirm: (number: number) => {
      return API.send_sms({
        number,
        typeContenu,
        url: window.location.href,
        title: titreInformatif,
      })
        .then((response: { status: number; statusText: string; data: any }) => {
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          return response.data;
        })
        .catch((error: Error) => {
          Swal.showValidationMessage(`Echec d'envoi: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: "Yay...",
        text: "Votre message a bien été envoyé, merci",
        type: "success",
        timer: 1500,
      });
    }
  });

export const sharingOptions = (
  typeContenu: string,
  titreInformatif: string
) => {
  // @ts-ignore
  if (navigator.share) {
    // @ts-ignore
    navigator
      .share({
        title: titreInformatif,
        text: typeContenu + " " + titreInformatif,
        url: window.location.href,
      })
      .then(() => {})
      .catch(() => {});
  }
};
