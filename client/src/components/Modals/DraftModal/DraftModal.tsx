import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
// @ts-ignore
import Icon from "react-eva-icons";
import "./DraftModal.scss";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import FButton from "../../FigmaUI/FButton/FButton";

interface Props {
  toggle: () => void;
  show: boolean;
  valider_dispositif: (arg: string) => void;
  navigateToProfilePage: () => void;
}

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
  margin-bottom: 28px;
`;

const MainContainer = styled.div`
  padding: 40px;
  border-radius: 12px;
`;
const InfosContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;
`;

const InfoContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #828282;
`;

const SubTitle = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 56px;
`;

const InfoFooter = styled.div`
  display: flex;
  flex-direction: row;
  background: #f2f2f2;
  border-radius: 6px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #0421b1;
  margin-top: 8px;
  padding: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
interface InfoProps {
  title: string;
  subTitle: string;
  footer: string;
  footerIcon: string;
}

const Info = (props: InfoProps) => (
  <InfoContainer>
    <Title>{props.title}</Title>
    <SubTitle>{props.subTitle}</SubTitle>
    <InfoFooter>
      <EVAIcon name={props.footerIcon} fill={"#0421B1"} className="mr-8" />
      {props.footer}
    </InfoFooter>
  </InfoContainer>
);

export const DraftModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle} className="draft">
    <MainContainer>
      <IconContainer onClick={props.toggle}>
        <Icon name="close-outline" fill="#3D3D3D" size="large" />
      </IconContainer>
      <Header>Sauvegarder</Header>
      <InfosContainer>
        <div style={{ marginRight: "8px" }}>
          <Info
            title="Pas de panique !"
            subTitle="Votre fiche est sauvegardée automatiquement :"
            footer="toutes les 3 minutes"
            footerIcon="clock-outline"
          />
        </div>
        <Info
          title="Bon à savoir"
          subTitle="Une fois sauvegardée, votre fiche est visible dans l'espace :"
          footer="Mes fiches"
          footerIcon="file-text-outline"
        />
      </InfosContainer>
      <ButtonsContainer>
        <FButton
          type="outline-black"
          name="log-out-outline"
          className="mr-8"
          onClick={() => {
            props.valider_dispositif("Brouillon");
            props.toggle();
            props.navigateToProfilePage();
          }}
        >
          Sauvegarder et quitter
        </FButton>
        <FButton
          type="validate"
          name="save-outline"
          onClick={() => {
            props.valider_dispositif("Brouillon");
            props.toggle();
          }}
        >
          Sauvegarder et continuer
        </FButton>
      </ButtonsContainer>
    </MainContainer>
  </Modal>
);
