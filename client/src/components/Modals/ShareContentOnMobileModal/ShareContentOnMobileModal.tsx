import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Icon from "react-eva-icons";
import "./ShareContentOnMobileModal.scss";
import ShareButton from "../../FigmaUI/ShareButton/ShareButton";
import Swal from "sweetalert2";
import API from "../../../utils/API";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
  content: {
    titreInformatif: string;
    titreMarque: string;
    abstract: string;
    contact: string;
    externalLink: string;
  };
  typeContenu: string;
}

const IconContainer = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  right: 40px;
  top: 30px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  cursor: pointer;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 20px;
`;

const MainContainer = styled.div`
  padding: 40px;
  border-radius: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const send_sms = (typeContenu: string, titreInformatif: string) =>
  Swal.fire({
    title: "Veuillez renseigner votre numéro de téléphone",
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

export const ShareContentOnMobileModal = (props: Props) => {
  const emailBody =
    "Voici le lien vers " +
    (props.typeContenu === "demarche" ? "la démarche" : "le dispositif") +
    " ''" +
    props.content.titreInformatif +
    "' : " +
    window.location.href;
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="draft">
      <MainContainer>
        <IconContainer onClick={props.toggle}>
          <Icon name="close-outline" fill="#FFFFFF" size="large" />
        </IconContainer>
        <Header>Partager la fiche</Header>
        <ButtonsContainer>
          <ShareButton
            name={"email-outline"}
            href={
              "mailto:mail@example.org?subject=Dispositif" +
              (props.content && props.content.titreMarque
                ? " - " + props.content.titreMarque
                : "") +
              `&body=${emailBody}`
            }
          >
            Via email
          </ShareButton>
          <ShareButton
            name={"smartphone-outline"}
            onClick={() =>
              send_sms(props.typeContenu, props.content.titreInformatif)
            }
          >
            Via sms
          </ShareButton>
          {/* <ShareButton
            name={"download-outline"}
            //className="ml-10"
            onClick={() => {}}
          >
            Télécharger PDF
          </ShareButton>
          <ShareButton
            name={"more-horizontal-outline"}
            //className="ml-10"
            onClick={() => {}}
          >
            Plus d'options
          </ShareButton> */}
        </ButtonsContainer>
      </MainContainer>
    </Modal>
  );
};
