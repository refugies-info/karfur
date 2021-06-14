import React, { Component } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Icon from "react-eva-icons";
import FButton from "../../FigmaUI/FButton/FButton";

interface Props {
  toggle: () => void;
  show: boolean;
  t: (a: string, b: string) => void;
  createPdf: () => void;
}

const getIFrameSrc = () => {
  return "https://www.loom.com/embed/b3493cec4f8f4ac3b59b11adabeb244a";
};
const IconContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
`;

const MainContainer = styled.div`
  padding: 40px;
  border-radius: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  line-height: 28px;
`;

const VideoContainer = styled.div`
  background: #d2edfc;
  border-radius: 12px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
`;

export class PdfCreateModal extends Component<Props> {
  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="dispo-create"
      >
        <MainContainer>
          <IconContainer onClick={this.props.toggle}>
            <Icon name="close-outline" fill="#3D3D3D" size="large" />
          </IconContainer>
          <HeaderContainer>
            <Header>
              {this.props.t(
                "Dispositif.Télécharger la fiche en PDF",
                "Télécharger la fiche en PDF"
              )}
            </Header>
          </HeaderContainer>

          <Subtitle>
            {this.props.t(
              "Dispositif.Enregistrez la fiche depuis la fenêtre d’impression de votre navigateur",
              "Enregistrez la fiche depuis la fenêtre d’impression de votre navigateur."
            )}
          </Subtitle>

          <VideoContainer>
            <iframe
              src={getIFrameSrc()}
              frameBorder="0"
              style={{
                top: "0",
                left: " 0",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
              }}
            ></iframe>
          </VideoContainer>
          <ButtonsContainer>
            <FButton
              type="white mr-10"
              name="close-outline"
              onClick={() => {
                this.props.toggle();
              }}
            >
              <div></div>
              {this.props.t("Annuler", "Annuler")}
            </FButton>
            <FButton
              type="validate"
              name="download-outline"
              onClick={() => {
                this.props.createPdf();
              }}
            >
              <div></div>
              {this.props.t("Dispositif.Télécharger", "Télécharger")}
            </FButton>
          </ButtonsContainer>
        </MainContainer>
      </Modal>
    );
  }
}
