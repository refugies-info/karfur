import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
// import Icon from "react-eva-icons";
// import "./DraftModal.scss";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import FButton from "../../FigmaUI/FButton/FButton";
import imageGreen from "../../../assets/illu_bonasavoir.svg";
import imageViolet from "../../../assets/illu_pasdepanique.svg";

interface Props {
  toggle: () => void;
  show: boolean;
  valider_dispositif: (
    arg: string,
    arg1: boolean,
    arg2: boolean,
    arg3: boolean,
    arg4: boolean
  ) => void;
  navigateToMiddleOffice: () => void;
  status: "string";
  toggleIsModified: (arg: boolean) => void;
  toggleIsSaved: (arg: boolean) => void;
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

const InfoContainerLeft = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  width: 280px;
  background-image: url(${imageViolet});
`;

const InfoContainerRight = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  width: 280px;
  background-image: url(${imageGreen});
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props) => props.color};
`;

const SubTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-top: 190px;
`;

const InfoFooter = styled.div`
  display: flex;
  flex-direction: row;
  background: #ffffff;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-top: 8px;
  padding: 8px;
  width: 212px;
`;

const InfoFooterRight = styled.div`
  display: flex;
  flex-direction: row;
  background: #ffffff;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-top: 8px;
  padding: 8px;
  width: 136px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
interface InfoProps {
  title: string;
  subTitle: string;
  footer: string;
  footerIcon: string;
  color: string;
}

const InfoLeft = (props: InfoProps) => (
  <InfoContainerLeft>
    <Title color={props.color}>{props.title}</Title>
    <SubTitle>{props.subTitle}</SubTitle>
    <InfoFooter>
      <EVAIcon
        size={10}
        name={props.footerIcon}
        fill={props.color}
        className="mr-8"
      />
      <div style={{ color: props.color }}>{props.footer}</div>
    </InfoFooter>
  </InfoContainerLeft>
);

const InfoRight = (props: InfoProps) => (
  <InfoContainerRight>
    <Title color={props.color}>{props.title}</Title>
    <SubTitle>{props.subTitle}</SubTitle>
    <InfoFooterRight>
      <EVAIcon
        size={10}
        name={props.footerIcon}
        fill={props.color}
        className="mr-8"
      />
      <div style={{ color: props.color }}>{props.footer}</div>
    </InfoFooterRight>
  </InfoContainerRight>
);

export const DraftModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle} className="draft">
    <MainContainer>
      <IconContainer onClick={props.toggle}>
        {/* <Icon name="close-outline" fill="#3D3D3D" size="large" /> */}
      </IconContainer>
      <Header>Sauvegarder</Header>
      <InfosContainer>
        <div style={{ marginRight: "8px" }}>
          <InfoLeft
            title="Pas de panique !"
            subTitle="Votre fiche est sauvegardée automatiquement"
            footer="toutes les 3 minutes"
            footerIcon="clock-outline"
            color="#3D2884"
          />
        </div>
        <InfoRight
          title="Bon à savoir"
          subTitle="Une fois sauvegardée, votre fiche est visible dans l'espace"
          footer="Mes fiches"
          footerIcon="file-text-outline"
          color="#149193"
        />
      </InfosContainer>
      <ButtonsContainer>
        <FButton
          type="outline-black"
          name="log-out-outline"
          className="mr-8"
          onClick={() => {
            props.valider_dispositif(
              props.status || "Brouillon",
              false,
              true,
              false,
              false
            );
            props.toggle();
            props.toggleIsModified(false);
            props.toggleIsSaved(true);
            props.navigateToMiddleOffice();
          }}
        >
          Finir plus tard
        </FButton>
        <FButton
          type="validate"
          name="save-outline"
          onClick={() => {
            props.valider_dispositif(
              props.status || "Brouillon",
              false,
              true,
              true,
              true
            );
            props.toggleIsModified(false);
            props.toggleIsSaved(true);
            props.toggle();
          }}
        >
          Sauvegarder et continuer à rédiger
        </FButton>
      </ButtonsContainer>
    </MainContainer>
  </Modal>
);
