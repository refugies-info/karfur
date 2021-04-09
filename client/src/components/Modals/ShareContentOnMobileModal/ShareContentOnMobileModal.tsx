import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Icon from "react-eva-icons";
import "./ShareContentOnMobileModal.scss";
import ShareButton from "../../FigmaUI/ShareButton/ShareButton";

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
          <ShareButton name={"smartphone-outline"} onClick={() => {}}>
            Via sms
          </ShareButton>
          <ShareButton
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
          </ShareButton>
        </ButtonsContainer>
      </MainContainer>
    </Modal>
  );
};
