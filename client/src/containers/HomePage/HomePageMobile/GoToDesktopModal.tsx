import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { rendez_vous_ordinateur } from "../../../assets/figma";
import { FButtonMobile } from "../../../components/FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "../../../colors";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
  t: (a: string, b: string) => void;
  toggleShowInvitationEmailModal: () => void;
}

const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin: 8px;
`;
const MainContainer = styled.div`
  text-align: center;
  padding: 29px;
  padding-top: 50px;
  margin: 8px;
`;
const TextContainer = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin: 16px;
`;
const ButtonContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const GoToDesktopModal = (props: Props) => (
  <Modal isOpen={props.show} toggle={props.toggle} className="share-content">
    <MainContainer>
      <img src={rendez_vous_ordinateur} alt="image newsletter" />
      <TitleContainer>
        {props.t(
          "Register.Rendez-vous sur votre ordinateur",
          "Rendez-vous sur votre ordinateur"
        )}
      </TitleContainer>
      <TextContainer>
        {props.t(
          "Register.Créez-vous un compte depuis votre ordinateur pour participer",
          "Créez-vous un compte depuis votre ordinateur pour participer"
        )}
      </TextContainer>
      <ButtonContainer>
        <FButtonMobile
          name="email-outline"
          isDisabled={false}
          fill="white"
          color={colors.noir}
          onClick={props.toggleShowInvitationEmailModal}
          t={props.t}
          title="Register.Me le rappeler par email"
          defaultTitle="Me le rappeler par email"
        />
      </ButtonContainer>
      <ButtonContainer>
        <FButtonMobile
          name="checkmark-outline"
          isDisabled={false}
          fill="white"
          color={colors.vert}
          onClick={props.toggle}
          t={props.t}
          title="Dispositif.compris"
          defaultTitle="Ok, compris !"
        />
      </ButtonContainer>
    </MainContainer>
  </Modal>
);
