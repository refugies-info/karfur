import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Icon from "react-eva-icons";
import "./ShareContentOnMobileModal.scss";

interface Props {
  toggle: () => void;
  show: boolean;
  valider_dispositif: (
    arg: string,
    arg1: boolean,
    arg2: boolean,
    arg3: boolean
  ) => void;
  navigateToMiddleOffice: () => void;
  status: "string";
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

export const ShareContentOnMobileModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle} className="draft">
    <MainContainer>
      <IconContainer onClick={props.toggle}>
        <Icon name="close-outline" fill="#3D3D3D" size="large" />
      </IconContainer>
      <Header>Partager la fiche</Header>
    </MainContainer>
  </Modal>
);
