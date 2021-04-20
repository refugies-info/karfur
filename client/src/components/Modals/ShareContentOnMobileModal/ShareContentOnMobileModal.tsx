import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Icon from "react-eva-icons";
import "./ShareContentOnMobileModal.scss";
import { ShareButton } from "../../FigmaUI/ShareButton/ShareButton";
import {
  send_sms,
  sharingOptions,
} from "../../../containers/Dispositif/function";

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
  t: any;
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
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="draft">
      <MainContainer>
        <IconContainer onClick={props.toggle}>
          <Icon name="close-outline" fill="#FFFFFF" size="large" />
        </IconContainer>
        <Header>
          {props.t("Dispositif.Partager Fiche", "Partager la fiche")}
        </Header>
        <ButtonsContainer>
          <ShareButton
            name={"email-outline"}
            content={props.content}
            type="a"
            text={props.t("Dispositif.Via email", "Via email")}
          />

          <ShareButton
            name={"smartphone-outline"}
            onClick={() =>
              send_sms(
                "Veuillez renseigner un numéro de téléphone",
                props.typeContenu,
                props.content.titreInformatif
              )
            }
            text={props.t("Dispositif.Via sms", "Via sms")}
            type="button"
          />

          <ShareButton
            name={"more-horizontal-outline"}
            onClick={() => {
              sharingOptions(
                props.typeContenu,
                props.content.titreInformatif,
                props.content.titreMarque
              );
            }}
            text={props.t("Dispositif.Plus options", "Plus d'options")}
            type="button"
          />
        </ButtonsContainer>
      </MainContainer>
    </Modal>
  );
};
